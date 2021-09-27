import { access, constants } from "fs-extra";
import { exec } from "child_process";

function validateFFpath(
  ffPath: string,
  binary: "ffmpeg" | "ffprobe",
): Promise<boolean> {
  if (typeof ffPath !== "string") {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    // check file is executable
    access(ffPath, constants.F_OK, (err) => {
      err && resolve(false);

      // check file identifies as ffmpeg or ffprobe
      exec(`${ffPath} -version`, (error, stdout, stderr) => {
        error !== null && resolve(false);
        stdout.startsWith(`${binary} version`) && resolve(true);
        stderr.startsWith(`${binary} version`) && resolve(true);
        resolve(false);
      });
    });
  });
}

export function validateFFmpeg(ffmpegPath: string): Promise<boolean> {
  return validateFFpath(ffmpegPath, "ffmpeg");
}

export function validateFFprobe(ffmpegPath: string): Promise<boolean> {
  return validateFFpath(ffmpegPath, "ffprobe");
}
