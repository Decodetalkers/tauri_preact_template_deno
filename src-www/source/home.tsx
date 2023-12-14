import Counter from "../components/Counter.tsx";
import { useSignal } from "@preact/signals";

import { invoke } from "@tauri-apps/api";

import { h } from "preact";

export default function Home() {
  const count = useSignal(0);
  const data: Promise<number> = invoke("change_count", { count: 0 });

  data.then((value) => {
    count.value = value;
  });

  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to fresh</h1>
        <p class="my-4">
          Try updating this message in the
          <code class="mx-2">./routes/index.tsx</code> file, and refresh.
        </p>
        <Counter count={count} />
      </div>
    </div>
  );
}
