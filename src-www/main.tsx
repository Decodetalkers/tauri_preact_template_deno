import { render } from "preact";

import { useState } from "preact/hooks";

import styled from "styled-components-deno";
import { invoke } from "@tauri-apps/api/core";

const Center = styled.div`
  background-color: #86efac;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const MainTitle = styled.div`
  font-size: 3em;
  font-weight: bold
`;

const Counter = styled.div`
  display: flex;
  gap: 32px;           /* Sets 32px spacing between flex items */
  padding-top: 24px;   /* Sets 24px padding at the top */
  padding-bottom: 24px;/* Sets 24px padding at the bottom */
`;

const CounterBtn = styled.button`
  padding-left: 0.5rem;       /* px-2 */
  padding-right: 0.5rem;      /* px-2 */
  padding-top: 0.25rem;       /* py-1 */
  padding-bottom: 0.25rem;    /* py-1 */
  border-color: #6b7280;      /* border-gray-500 */
  border-width: 2px;          /* border-2 */
  border-radius: 0.25rem;     /* rounded */
  background-color: #ffffff;  /* bg-white */
  transition-property: background-color; /* transition-colors */
  transition-duration: 150ms; /* default transition duration */
  &:hover {
    background-color: #e5e7eb;  /* hover:bg-gray-200 */
  }
`;

const CounterText = styled.p`
  font-size: 1.875rem; /* or 30px */
  line-height: 4px; /* or 36px */
`;

const mount = document.getElementById("mount");

if (mount) {
  render(<App />, mount);
}

const start_val: number | undefined = await invoke("change_count", {
  count: 0,
});

function App() {
  const [counter, setCounter] = useState(start_val || 0);

  const updateCounter = async (newnum: number) => {
    const new_val: number | undefined = await invoke("change_count", {
      count: newnum,
    });
    if (new_val != undefined) {
      setCounter(new_val);
    }
  };

  return (
    <main>
      <Center>
        <img src="/static/apple.jpg" />
        <MainTitle>Welcome</MainTitle>
        <Counter>
          <CounterBtn
            onClick={async () => await updateCounter(-1)}
          >
            -1
          </CounterBtn>
          <CounterText>{counter}</CounterText>
          <CounterBtn onClick={async () => await updateCounter(1)}>
            +1
          </CounterBtn>
        </Counter>
      </Center>
    </main>
  );
}
