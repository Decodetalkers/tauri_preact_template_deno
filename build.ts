import { resolve } from 'std/path/mod.ts';
import * as esbuild from 'esbuild';
import { denoPlugins } from "esbuild_deno_loader";

if (Deno.args[0] === 'build') {
  await esbuild.build(await createOptions(Deno.args[1]))
  esbuild.stop()
} else if (Deno.args[0] === 'dev') {
  const ctx = await esbuild.context(await createOptions());
  await ctx.serve({
    port: 3000,
    servedir: './src-www',
  });
  await ctx.watch();
}

async function createOptions(srcPath: string | undefined = undefined) : Promise<esbuild.BuildOptions> {
  const denoJSONFileURL = new URL('file://' + resolve('./deno.json'));

  const denoJSON = await (await fetch(denoJSONFileURL)).json();
  const importMap = {
    imports: denoJSON.imports,
  };

  const       importMapURL = `data:application/json,${JSON.stringify(importMap)}`;

  return {
    plugins: [...denoPlugins({ importMapURL })],
    entryPoints: [srcPath ? srcPath + "index.ts" : './src-www/index.tsx'],
    outfile: srcPath ? srcPath + "dist/main.js" : './src-www/dist/main.js',
    bundle: true,
    format: 'esm',
    treeShaking: true,
    logLevel: "verbose",
    jsx: 'automatic',
    jsxImportSource: 'preact',
  }
}
