/**
 * @file rotateCmd.ts
 * @description Module containing the rotate command
 *
 * @exports rotateCmd
 */
import { Command } from "commander";
import { parseCenter, parsePoints, rotate } from "../rotate.js";

const rotateCmd = new Command("rotate")
  .action((pointsStr: string, angleStr: string, centerStr: string) => {
    try {
      const points = parsePoints(pointsStr);
      const angle = parseFloat(angleStr);
      const [cx, cy] = parseCenter(centerStr);

      if (isNaN(angle) || isNaN(cx) || isNaN(cy)) {
        throw new Error("Angle or center must be valid numbers.");
      }

      const rotatedPoints: [number, number][] = points.map(([x, y]) =>
        rotate(x, y, angle, cx, cy)
      );

      // Format output
      const formatCoord = (num: number) =>
        num.toFixed(10).replace(/\.?0+$/, "");

      if (points.length === 1) {
        const [nx, ny] = rotatedPoints[0];
        console.log(
          `New coordinates: (${formatCoord(nx)}, ${formatCoord(ny)})`
        );
      } else {
        const formatted = rotatedPoints
          .map(([nx, ny]) => `(${formatCoord(nx)}, ${formatCoord(ny)})`)
          .join(" ");
        console.log(`New coordinates: [${formatted}]`);
      }
    } catch (error) {
      console.error("Error:", (error as Error).message);
      process.exit(1);
    }
  })
  .argument(
    "<points>",
    "Point(s) to rotate, e.g., '(50,96)' or '[(50,96) (510,296)]'"
  )
  .argument("<angle>", "Angle to rotate (degrees)")
  .argument("<center>", "Center point, e.g., '(256,256)'")
  .description("Rotate point(s) around a center point");

export { rotateCmd };
