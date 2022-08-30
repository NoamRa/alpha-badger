import type { Progress } from "./types";

export function parseProgress(data: string): Progress {
  return data.split(new RegExp(`\r\n|\r|\n`)).reduce(
    (prog: Progress, line: string) => ({
      ...prog,
      ...parseProgressLine(line),
    }),
    {},
  );
}

function parseProgressLine(progressLine: string): Progress {
  // Remove all spaces after equals sign (ex: `=  `) and trim.
  // each progress part is a key-value pair. ex: "frame=123", "time=01:23:45.67"
  const progressParts: string[] = progressLine
    .replace(/=\s+/g, "=")
    .trim()
    .split(" ");

  // build progress object
  const progress: Progress = {};
  for (const keyValuePair of progressParts) {
    const [key, value] = keyValuePair.split("=", 2).map((v) => v.trim());
    if (typeof value !== "undefined") {
      const valueAsNumber = +value;
      progress[key] = Number.isNaN(valueAsNumber) ? value : valueAsNumber;
    }
  }

  return progress;
}
