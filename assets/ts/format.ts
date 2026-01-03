/**
 * @file format.ts
 * @description Module containing the format function
 *
 * @exports format
 */

import { readFileSync, writeFileSync } from "fs";
import pkg, {
  Command,
  MoveToCommand,
  LineToCommand,
  HorizontalLineToCommand,
  VerticalLineToCommand,
  CurveToCommand,
  SmoothCurveToCommand,
  QuadraticCurveToCommand,
  SmoothQuadraticCurveToCommand,
  EllipticalArcCommand,
} from "svg-path-parser";

const { makeAbsolute, parseSVG } = pkg;

/**
 * Formats an SVG document
 *
 * @param {string} filepath - Path to the SVG file
 *
 * @returns {void}
 */
function format(filepath: string): void {
  try {
    console.log(`Formatting ${filepath}...`);

    // Read the SVG file
    const svgContent = readFileSync(filepath, "utf-8");

    // Find all path elements with d attributes
    const pathRegex = /<path[^>]*\sd="([^"]+)"[^>]*>/g;

    let formattedContent = svgContent;
    let match;

    while ((match = pathRegex.exec(svgContent)) !== null) {
      const fullPathTag = match[0];
      const originalD = match[1];

      try {
        // Parse and convert the path data
        const formattedD = formatPathData(originalD);

        // Replace the original path data with formatted version
        const formattedPathTag = fullPathTag.replace(
          `d="${originalD}"`,
          `d="${formattedD}"`
        );

        formattedContent = formattedContent.replace(
          fullPathTag,
          formattedPathTag
        );
      } catch (error) {
        console.warn(
          `Warning: Could not format path: ${originalD.substring(0, 50)}...`
        );
        console.warn(`Error: ${error}`);
      }
    }

    // Write the formatted content back to the file
    writeFileSync(filepath, formattedContent, "utf-8");
    console.log(`Successfully formatted ${filepath}`);
  } catch (error) {
    console.error(`Error formatting file ${filepath}:`, error);
    process.exit(1);
  }
}

/**
 * Formats SVG path data by converting relative commands to absolute
 * and standardizing coordinate formatting
 *
 * @param {string} pathData - Original path data string
 * @returns {string} Formatted path data string
 */
function formatPathData(pathData: string): string {
  // Parse the SVG path
  const commands = parseSVG(pathData);

  // Convert all commands to absolute
  const absoluteCommands = makeAbsolute(commands);

  // Format each command according to our preferences
  const formattedCommands = absoluteCommands.map(formatCommand);

  // Join commands with spaces
  return formattedCommands.join(" ");
}

/**
 * Formats a single command according to our preferences
 *
 * @param {Command} command - Command object from svg-path-parser
 * @returns {string} Formatted command string
 */
function formatCommand(command: Command): string {
  switch (command.code) {
    case "M": // moveto
    case "L": // lineto
    case "T": // shorthand quadratic Bézier
      const moveLineCmd = command as
        | MoveToCommand
        | LineToCommand
        | SmoothQuadraticCurveToCommand;
      return `${command.code}${moveLineCmd.x},${moveLineCmd.y}`;

    case "H": // horizontal lineto
      const horizCmd = command as HorizontalLineToCommand;
      return `${command.code}${horizCmd.x}`;

    case "V": // vertical lineto
      const vertCmd = command as VerticalLineToCommand;
      return `${command.code}${vertCmd.y}`;

    case "C": // curveto
      const curveCmd = command as CurveToCommand;
      return `${command.code}${curveCmd.x1},${curveCmd.y1} ${curveCmd.x2},${curveCmd.y2} ${curveCmd.x},${curveCmd.y}`;

    case "S": // shorthand curveto
      const smoothCurveCmd = command as SmoothCurveToCommand;
      return `${command.code}${smoothCurveCmd.x2},${smoothCurveCmd.y2} ${smoothCurveCmd.x},${smoothCurveCmd.y}`;

    case "Q": // quadratic Bézier
      const quadCmd = command as QuadraticCurveToCommand;
      return `${command.code}${quadCmd.x1},${quadCmd.y1} ${quadCmd.x},${quadCmd.y}`;

    case "A": // elliptical arc
      const arcCmd = command as EllipticalArcCommand;
      return `${command.code}${arcCmd.rx} ${arcCmd.ry} ${
        arcCmd.xAxisRotation
      } ${arcCmd.largeArc ? 1 : 0} ${arcCmd.sweep ? 1 : 0} ${arcCmd.x},${
        arcCmd.y
      }`;

    case "Z": // closepath
    case "z":
      return "Z";

    default:
      // Fallback for any unexpected commands
      console.warn(`Warning: Unhandled command code: ${command.code}`);
      return reconstructCommand(command);
  }
}

/**
 * Fallback function to reconstruct commands that aren't explicitly handled
 *
 * @param {Command} command - Command object
 * @returns {string} Reconstructed command string
 */
function reconstructCommand(command: Command): string {
  // Type-safe reconstruction using the command code
  const code = command.code;

  switch (code) {
    case "M":
    case "L":
    case "T": {
      const cmd = command as
        | MoveToCommand
        | LineToCommand
        | SmoothQuadraticCurveToCommand;
      return `${code}${cmd.x},${cmd.y}`;
    }
    case "H": {
      const cmd = command as HorizontalLineToCommand;
      return `${code}${cmd.x}`;
    }
    case "V": {
      const cmd = command as VerticalLineToCommand;
      return `${code}${cmd.y}`;
    }
    case "C": {
      const cmd = command as CurveToCommand;
      return `${code}${cmd.x1},${cmd.y1} ${cmd.x2},${cmd.y2} ${cmd.x},${cmd.y}`;
    }
    case "S": {
      const cmd = command as SmoothCurveToCommand;
      return `${code}${cmd.x2},${cmd.y2} ${cmd.x},${cmd.y}`;
    }
    case "Q": {
      const cmd = command as QuadraticCurveToCommand;
      return `${code}${cmd.x1},${cmd.y1} ${cmd.x},${cmd.y}`;
    }
    case "A": {
      const cmd = command as EllipticalArcCommand;
      return `${code}${cmd.rx} ${cmd.ry} ${cmd.xAxisRotation} ${
        cmd.largeArc ? 1 : 0
      } ${cmd.sweep ? 1 : 0} ${cmd.x},${cmd.y}`;
    }
    case "Z":
    case "z":
      return "Z";
    default:
      // For any completely unexpected command, stringify what we have
      const coords = Object.entries(command)
        .filter(([key]) => !["code", "relative", "command"].includes(key))
        .map(([, value]) => value)
        .join(",");
      return `${code}${coords}`;
  }
}

export { format };
