import { resolve } from "std/path/mod.ts";
import * as esbuild from "esbuild";
import { denoPlugins } from "esbuild_deno_loader";
import { copySync } from "https://deno.land/std@0.201.0/fs/copy.ts";

const srcPath = Deno.args[1];
const buildType = Deno.args[0];

if (buildType === "build") {
  ensureDir(srcPath);
  await esbuild.build(await createOptions(srcPath));
  esbuild.stop();
} else if (buildType === "dev") {
  ensureDir();
  const ctx = await esbuild.context(await createOptions());
  await ctx.serve({
    port: 3000,
    servedir: "./src-www/dist",
  });
  await ctx.watch();
}

function ensureDir(srcPath: string | undefined = undefined) {
  const distDir = srcPath ? srcPath + "dist" : "./src-www/dist";
  const options = { overwrite: true };
  copySync("./src-www/static", distDir, options);
}

async function createOptions(
  srcPath: string | undefined = undefined,
): Promise<esbuild.BuildOptions> {
  const denoJSONFileURL = new URL("file://" + resolve("./deno.json"));

  const denoJSON = await (await fetch(denoJSONFileURL)).json();
  const importMap = {
    imports: denoJSON.imports,
  };

  const importMapURL = `data:application/json,${JSON.stringify(importMap)}`;

  return {
    plugins: [...denoPlugins({ importMapURL })],
    entryPoints: [srcPath ? srcPath + "index.ts" : "./src-www/index.tsx"],
    outdir: srcPath ? srcPath + "dist" : "./src-www/dist/",
    bundle: true,
    format: "esm",
    treeShaking: true,
    logLevel: "verbose",
    jsx: "automatic",
    jsxImportSource: "preact",
  };
}
