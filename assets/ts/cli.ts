#!/usr/bin/env node

import { Command } from "commander";
import { rotateCmd } from "./commands/rotateCmd.js";

const program = new Command()
  .description("Command-line tool for 2D geometric transformations.")
  .name("jiometry-cli")
  .version("1.0.0");

program.addCommand(rotateCmd);

program.parse();
