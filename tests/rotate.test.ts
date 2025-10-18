import {
  parseCenter,
  parsePoints,
  parsePoint,
  rotate,
} from "../assets/ts/rotate";

describe("rotate", () => {
  it("should rotate (1, 0) around (0, 0) by 90 degrees to (0, 1)", () => {
    const result = rotate(1, 0, 90, 0, 0);
    expect(result[0]).toBeCloseTo(0, 12);
    expect(result[1]).toBeCloseTo(1, 12);
  });

  it("should rotate (1, 0) around (0, 0) by 180 degrees to (-1, 0)", () => {
    const result = rotate(1, 0, 180, 0, 0);
    expect(result[0]).toBeCloseTo(-1, 12);
    expect(result[1]).toBeCloseTo(0, 12);
  });

  it("should rotate (1, 1) around (0, 0) by 90 degrees to (-1, 1)", () => {
    const result = rotate(1, 1, 90, 0, 0);
    expect(result[0]).toBeCloseTo(-1, 12);
    expect(result[1]).toBeCloseTo(1, 12);
  });

  it("should rotate (2, 3) around (1, 1) by 0 degrees (unchanged)", () => {
    const result = rotate(2, 3, 0, 1, 1);
    expect(result).toEqual([2, 3]);
  });

  it("should rotate (0, 0) around (0, 0) by 360 degrees (unchanged)", () => {
    const result = rotate(0, 0, 360, 0, 0);
    expect(result).toEqual([0, 0]);
  });

  it("should handle negative angles (e.g., -90 degrees)", () => {
    const result = rotate(1, 0, -90, 0, 0);
    expect(result[0]).toBeCloseTo(0, 12);
    expect(result[1]).toBeCloseTo(-1, 12);
  });

  it("should handle floating-point precision reasonably", () => {
    const result = rotate(1, 1, 45, 0, 0);
    // For 45° counterclockwise: nx ≈ 0, ny ≈ √2 ≈ 1.4142
    expect(result[0]).toBeCloseTo(0, 12);
    expect(result[1]).toBeCloseTo(Math.SQRT2, 12);
  });

  it("should handle floating-point precision reasonably", () => {
    const result = rotate(1, 1, 45, 0, 0);
    // For 45°: nx ≈ 0, ny ≈ √2 ≈ 1.4142
    expect(result[0]).toBeCloseTo(0, 4);
    expect(result[1]).toBeCloseTo(1.4142, 4);
  });
});

describe("parsePoint", () => {
  it("should parse '(50,96)' to [50, 96]", () => {
    const result = parsePoint("(50,96)");
    expect(result).toEqual([50, 96]);
  });

  it("should parse '( 50 , 96 )' with extra spaces to [50, 96]", () => {
    const result = parsePoint("( 50 , 96 )");
    expect(result).toEqual([50, 96]);
  });

  it("should return null for invalid format '(50,abc)'", () => {
    const result = parsePoint("(50,abc)");
    expect(result).toBeNull();
  });

  it("should return null for invalid format '(50)'", () => {
    const result = parsePoint("(50)");
    expect(result).toBeNull();
  });

  it("should return null for non-point string 'invalid'", () => {
    const result = parsePoint("invalid");
    expect(result).toBeNull();
  });
});

describe("parsePoints", () => {
  it("should parse single point '(50,96)' to [[50, 96]]", () => {
    const result = parsePoints("(50,96)");
    expect(result).toEqual([[50, 96]]);
  });

  it("should parse set '[(50,96) (510,296)]' to [[50, 96], [510, 296]]", () => {
    const result = parsePoints("[(50,96) (510,296)]");
    expect(result).toEqual([
      [50, 96],
      [510, 296],
    ]);
  });

  it("should parse set with extra spaces '[( 50 , 96 ) ( 510 , 296 )]' to [[50, 96], [510, 296]]", () => {
    const result = parsePoints("[( 50 , 96 ) ( 510 , 296 )]");
    expect(result).toEqual([
      [50, 96],
      [510, 296],
    ]);
  });

  it("should throw error for empty string", () => {
    expect(() => parsePoints("")).toThrow(
      'Invalid points format: . Use "(x,y)" or "[(x,y) (x,y)]".'
    );
  });

  it("should throw error for invalid single point '(50,abc)'", () => {
    expect(() => parsePoints("(50,abc)")).toThrow(
      'Invalid points format: (50,abc). Use "(x,y)" or "[(x,y) (x,y)]".'
    );
  });

  it("should throw error for invalid set '[invalid]'", () => {
    expect(() => parsePoints("[invalid]")).toThrow(
      'Invalid points format: [invalid]. Use "(x,y)" or "[(x,y) (x,y)]".'
    );
  });

  it("should parse valid points from mixed input ignoring invalid text", () => {
    const result = parsePoints("[ (50,96) invalid ]");
    expect(result).toEqual([[50, 96]]);
  });

  it("should throw error for set with only invalid text '[invalid]' ", () => {
    expect(() => parsePoints("[invalid]")).toThrow(
      'Invalid points format: [invalid]. Use "(x,y)" or "[(x,y) (x,y)]".'
    );
  });
});

describe("parseCenter", () => {
  it("should parse '(256,256)' to [256, 256]", () => {
    const result = parseCenter("(256,256)");
    expect(result).toEqual([256, 256]);
  });

  it("should parse '( 256 , 256 )' with extra spaces to [256, 256]", () => {
    const result = parseCenter("( 256 , 256 )");
    expect(result).toEqual([256, 256]);
  });

  it("should throw error for invalid format 'invalid'", () => {
    expect(() => parseCenter("invalid")).toThrow(
      'Invalid center format: invalid. Use "(cx,cy)" or pass separate cx cy.'
    );
  });

  it("should throw error for invalid pair '(256,abc)'", () => {
    expect(() => parseCenter("(256,abc)")).toThrow(
      'Invalid center format: (256,abc). Use "(cx,cy)" or pass separate cx cy.'
    );
  });
});
