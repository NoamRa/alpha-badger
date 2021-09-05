import { Progress } from "./types";

export function parseProgress(progressLine: string): Progress {
  // Remove all spaces after = and trim.
  // each progress part is a key-value pai. ex: "frame=123", "time=01:23:45.67"
  const progressParts: string[] = progressLine
    .replace(/=\s+/g, "=")
    .trim()
    .split(" ");

  // build progress object
  const progress: Progress = {};
  for (const keyValuePair of progressParts) {
    const [key, value] = keyValuePair.split("=", 2).map((v) => v.trim());
    if (typeof value === "undefined") return null;
    const valueAsNumber = +value;
    progress[key] = Number.isNaN(valueAsNumber) ? value : valueAsNumber;
  }

  return progress;
}
