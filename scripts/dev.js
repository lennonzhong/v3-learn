import minimist from "minimist";
import chalk from "chalk";
import {resolve } from "path";
import esbuild from "esbuild";
import { createRequire } from "module"

const __dirname = process.cwd();
const args = minimist(process.argv.slice(2));
const target = args._[0] || "index";
const format = args.f || "iife";
const require = createRequire(__dirname);

console.log(chalk.bgGreen(`Building ${target} in ${format} format...`));

let entry = resolve(__dirname, `packages/${target}/src/index.ts`);
const pkg = require(resolve(__dirname, `./packages/${target}/package.json`));


esbuild.context({
  entryPoints: [entry],
  outfile: resolve(
    __dirname,
    `./packages/${target}/dist/${target}-${format}.js`
  ),
  platform: "browser",
  format,
  globalName: pkg.buildOptions.name,
  bundle: true
}).then(ctx=>{
  console.log(chalk.bgGreen(`Building ${target} in ${format} format end...`));
  ctx.watch();
})