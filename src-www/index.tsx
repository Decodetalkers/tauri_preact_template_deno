import { h, render } from "preact";
import Home from "./source/home.tsx";

const mountPoint = document.getElementById("root") as HTMLElement;
if (mountPoint) render(<Home />, mountPoint);
