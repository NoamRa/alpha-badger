import { promisify } from "node:util";
import cp from "node:child_process";
import { invalidFFprobeError, missingFFprobeError } from "../dialogs";

import { validateFFprobe } from "./validateFFpath";
import { store } from "../store";
const exec = promisify(cp.exec);

export async function readMetadata(filePath: string): Promise<FFprobeJSON> {
  const ffprobePath = store.getFFprobePath();
  if (!ffprobePath) {
    missingFFprobeError();
    throw new Error("ffprobe is missing");
  }

  if (!(await validateFFprobe(ffprobePath))) {
    invalidFFprobeError(ffprobePath);
    throw new Error("ffprobe is invalid");
  }

  const { stdout } = await exec(
    `${ffprobePath} -show_format -show_streams -print_format json -i ${filePath}`,
  );

  return JSON.parse(stdout);
}
