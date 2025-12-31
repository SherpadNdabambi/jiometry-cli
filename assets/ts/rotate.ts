import { Command } from "commander";
import { Console } from "console";

/**
 * Rotates a point about a center point.
 * @param x The x-coordinate of the point to be rotated.
 * @param y The y-coordinate of the point to be rotated.
 * @param angle The angle to rotate the point (in degrees).
 * @param cx The x-coordinate of the center point.
 * @param cy The y-coordinate of the center point.
 * @returns The new coordinates of the point after rotation.
 */
function rotate(
  x: number,
  y: number,
  angle: number,
  cx: number,
  cy: number
): [number, number] {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  const nx = cos * (x - cx) - sin * (y - cy) + cx;
  const ny = sin * (x - cx) + cos * (y - cy) + cy;

  return [nx, ny];
}

/**
 * Parses a string representing a single point or a set of points.
 * - Single: "(50,96)" -> [[50, 96]]
 * - Set: "[(50,96) (510,296)]" -> [[50, 96], [510, 296]]
 * @param pointsStr The input string.
 * @returns Array of [x, y] pairs.
 */
function parsePoints(pointsStr: string): number[][] {
  // Trim whitespace
  pointsStr = pointsStr.trim();

  let points: number[][] = [];

  if (pointsStr.startsWith("[")) {
    // Parse set: extract point groups with regex to handle spaces
    const inner = pointsStr.slice(1, -1).trim();
    const pointMatches = inner.match(/\([^)]+\)/g) || [];
    for (const pStr of pointMatches) {
      const parsed = parsePoint(pStr);
      if (parsed) points.push(parsed);
    }
  } else if (pointsStr.startsWith("(")) {
    // Parse single point
    const parsed = parsePoint(pointsStr);
    if (parsed) points.push(parsed);
  }

  if (points.length === 0) {
    throw new Error(
      `Invalid points format: ${pointsStr}. Use "(x,y)" or "[(x,y) (x,y)]".`
    );
  }

  return points;
}

/**
 * Parses a single point string like "(50,96)" into [50, 96].
 * @param pointStr The point string.
 * @returns [x, y] or null if invalid.
 */
function parsePoint(pointStr: string): number[] | null {
  // Remove parentheses and trim
  const clean = pointStr.slice(1, -1).trim();

  // Split by comma (handle spaces)
  const parts = clean.split(",").map((p) => p.trim());

  if (parts.length !== 2) return null;

  const x = parseFloat(parts[0]);
  const y = parseFloat(parts[1]);

  if (isNaN(x) || isNaN(y)) return null;

  return [x, y];
}

/**
 * Parses center string: either "(cx,cy)" or separate cx cy as fallback.
 * @param centerStr Center input.
 * @returns [cx, cy].
 */
function parseCenter(centerStr: string): [number, number] {
  if (centerStr.startsWith("(")) {
    const parsed = parsePoint(centerStr);
    if (parsed) return [parsed[0], parsed[1]];
  }

  // Fallback: assume two separate args, but since it's one arg, error if not pair
  throw new Error(
    `Invalid center format: ${centerStr}. Use "(cx,cy)" or pass separate cx cy.`
  );
}



export { parseCenter, parsePoint, parsePoints, rotate };
