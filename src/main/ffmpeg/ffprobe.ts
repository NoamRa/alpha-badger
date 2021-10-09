import { promisify } from "util";
import * as cp from "child_process";
import type { FFprobeJSON } from "./types";
import { invalidFFprobeError, missingFFprobeError } from "../dialogs";
import { store } from "../store";

import { validateFFprobe } from "./validateFFpath";
const exec = promisify(cp.exec);

export async function readMetadata(filePath: string): Promise<FFprobeJSON | void> {
  const ffprobePath = store.get("ffprobePath") as string;
  if (!ffprobePath) {
    missingFFprobeError();
    return;
  }

  if (!(await validateFFprobe(ffprobePath))) {
    invalidFFprobeError(ffprobePath);
    return;
  }

  const { stdout } = await exec(
    `${ffprobePath} -show_format -show_streams -print_format json -i ${filePath}`,
  );

  return JSON.parse(stdout);
}
