export type Progress = Record<string, string | number>;
export function parseProgress(
  progressLine: string,
  callback?: (progress: Progress) => unknown,
): Progress {
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

  // do something with progress object
  // console.log(progress);
  if (typeof callback === "function") {
    callback(progress);
  }
  return progress;
}
