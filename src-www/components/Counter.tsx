import { h } from "preact";
import { JSX } from "preact";
import type { Signal } from "@preact/signals";
import { invoke } from "@tauri-apps/api";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      class="px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors"
    />
  );
}

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  async function greet(count: number) {
    const newcount: number = await invoke("change_count", { count: count });
    props.count.value = newcount;
  }
  const decrease = async () => await greet(-1);
  const increase = async () => await greet(1);

  return (
    <div class="flex gap-8 py-6">
      <Button onClick={decrease}>-1</Button>
      <p class="text-3xl">{props.count}</p>
      <Button onClick={increase}>+1</Button>
    </div>
  );
}
