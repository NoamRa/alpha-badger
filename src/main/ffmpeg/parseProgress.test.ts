import { parseProgress } from "./parseProgress";

describe("Test parseProgress", () => {
  it("should parse progress string", () => {
    const example = `
      foo=BAR fps=2     width=high!   number=5 percent=66%

      time=01:23:45.67      last=one
    `;
    expect(parseProgress(example)).toEqual({
      foo: "BAR",
      fps: 2,
      number: 5,
      percent: "66%",
      width: "high!",
      time: "01:23:45.67",
      last: "one",
    });
  });
});
