export function parseProgress(
  progressLine: string,
): Record<string, number | string> {
  // Remove all spaces after = and trim.
  // each progress part is a key-value pair. ex: "frame=123", "time=01:23:45.67"
  const progressParts: string[] = progressLine
    .trim()
    .replace(/=\s+/g, "=")
    .trim()
    .split(" ");

  // build progress object
  const progress: Record<string, number | string> = {};
  for (const keyValuePair of progressParts) {
    const [key, value] = keyValuePair.split("=", 2).map((v) => v.trim());
    if (typeof value !== "undefined") {
      const valueAsNumber = +value;
      progress[key] = Number.isNaN(valueAsNumber) ? value : valueAsNumber;
    }
  }

  return progress;
}
