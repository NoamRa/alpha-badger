import { access, constants } from "fs-extra";
import { exec } from "child_process";

export function validateFFmpeg(ffmpegPath: string): Promise<boolean> {
  if (typeof ffmpegPath !== "string") {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    // check file is executable
    access(ffmpegPath, constants.F_OK, (err) => {
      err && resolve(false);

      // check file identifies as ffmpeg
      exec(`${ffmpegPath} -version`, (error, stdout, stderr) => {
        error !== null && resolve(false);
        stdout.startsWith("ffmpeg version") && resolve(true);
        stderr.startsWith("ffmpeg version") && resolve(true);
        resolve(false);
      });
    });
  });
}
