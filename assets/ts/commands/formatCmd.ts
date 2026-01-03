/**
 * @file formatCmd.ts
 * @description Module containing the format command
 *
 * @exports formatCmd
 */
import { Command } from "commander";
import { format } from "../format.js";

const formatCmd = new Command("format")
  .action(format)
  .argument("<input_file_path>", "Input file")
  .description("Format an svg document");

export { formatCmd };
