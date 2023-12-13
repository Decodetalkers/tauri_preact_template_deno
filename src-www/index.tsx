import { h, render } from "preact";
//import { useEffect } from "preact/hooks";
import { invoke } from "@tauri-apps/api";
import { signal } from "@preact/signals";

const greetingText = signal("Did not yet greet");

invoke("greet", { name: "Jone" }).then((res) => {
  console.log(res);
}).catch((e) => {
  greetingText.value = e;
  console.log(e);
});

function App() {
  const handleHelloWorld = async () => {
    const text: string = await invoke("greet", { name: "Jone" });
    greetingText.value = text;
  };
  return (
    <div>
      <div>
        {greetingText.value}
      </div>
      <button className="button" onClick={handleHelloWorld}>hello</button>
    </div>
  );
}

const mountPoint = document.getElementById("root") as HTMLElement;
if (mountPoint) render(<App />, mountPoint);
