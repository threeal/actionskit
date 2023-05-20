#!/usr/bin/env node

import { spawnSync } from "child_process";
import { Command } from "commander";

function exec(command: string, ...args: string[]) {
  spawnSync(command, args, { stdio: "inherit" });
}

const program = new Command();

program
  .command("build")
  .description("compile source files from TypeScript to JavaScript")
  .action(() => exec("tsc"));

program
  .command("clean")
  .description("clean the build output directory")
  .action(() => exec("rimraf", "lib"));

program
  .command("format")
  .description("format the source files using Prettier")
  .action(() => exec("prettier", "--write", "*.{js,ts,json}", "src/**/*.ts"));

program.parse();
