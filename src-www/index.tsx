import { h, render } from "preact";
//import { useEffect } from "preact/hooks";
import { invoke } from "@tauri-api/tauri";
import { signal } from "@preact/signals";

const greetingText = signal("Did not yet greet");

//await invoke("greet", { name: "Jone" });

function App() {
  return <div>{"ggg"}</div>;
}

const mountPoint = document.getElementById("root") as HTMLElement;
if (mountPoint) render(<App />, mountPoint);
