import { serveDir } from "@std/http";

import { parseArgs } from "@std/cli";
import {
  GenWebsite,
  refreshMiddleware,
  Route,
  watchChanges,
  WebPageUnit,
} from "@nobody/tananoni";

interface BuildMode {
  debug?: boolean;
  release?: boolean;
}

const input_args = parseArgs(Deno.args) as BuildMode;

const release_mode = input_args.release;

const fsRoot = `${Deno.cwd()}/dist/`;

const base_asserts = { path: "static/asserts", alias: "static" };
const css_asserts = { path: "static/styles" };

const mainroutin = new Route()
  .append_assert(base_asserts)
  .append_assert(css_asserts)
  .append_webpage(
    new WebPageUnit(
      "./src-www/main.tsx",
      [{ type: "main", id: "mount" }],
      [{ type: "module", src: "main.js" }],
    )
      .with_title("template")
      .with_linkInfos([
        { type: "stylesheet", href: "styles/global.css" },
        { type: "icon", href: "static/favicon.ico" },
      ])
      .then((webpage) => {
        if (!release_mode) {
          webpage.with_hotReload();
        }
        return webpage;
      }),
  )
  .with_hotReload(!release_mode);

const webgen = new GenWebsite()
  .withLogLevel("info")
  .withImportSource("npm:preact");

await webgen.generate_website(mainroutin);

if (release_mode) {
  Deno.exit(0);
}

Deno.serve({ hostname: "localhost", port: 8000 }, async (req) => {
  const res = refreshMiddleware(req);

  if (res) {
    return res;
  }

  return await serveDir(req, { fsRoot });
});

async function fsWatch() {
  await webgen.generate_website(mainroutin);
}

await watchChanges({
  watchedDir: "./",
  watchedFileTypes: [".ts", ".tsx", ".css", ".md"],
  excludes: ["dist", "build.ts", "build.ts~"],
  fallback: fsWatch,
});
