import { dialog } from "electron";
import { validateFFmpeg, validateFFprobe } from "./ffmpeg/validateFFpath";

export function promptFilesToRender(): void {
  const files = dialog.showOpenDialog({
    properties: ["openFile"],
    title: "Add to render queue",

    // filters: [{ name: "video files", extensions: ["mov"] }],// should be passed by template
  });

  if (!files) return;

  console.log(files);
}

export async function promptFFmpegPath(): Promise<string | undefined> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    title: "Select FFmpeg binary",
  });

  if (canceled) {
    return undefined;
  }

  const isValid = await validateFFmpeg(filePaths[0]);
  if (isValid) {
    return filePaths[0];
  } else {
    invalidFFpathError(filePaths[0], "FFmpeg");
    return undefined;
  }
}

export async function promptFFprobePath(): Promise<string | undefined> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    title: "Select FFprobe binary",
  });

  if (canceled) {
    return undefined;
  }

  const isValid = await validateFFprobe(filePaths[0]);
  if (isValid) {
    return filePaths[0];
  } else {
    invalidFFpathError(filePaths[0], "FFprobe");
    return undefined;
  }
}

function invalidFFpathError(
  ffPath: string,
  binary: "FFmpeg" | "FFprobe",
): void {
  dialog.showErrorBox(
    `Failed to open ${binary} executable`,
    "The file at\n" +
      ffPath +
      `\nis not an ${binary} executable. ` +
      "\nPlease download from https://ffmpeg.org/download.html and choose again",
  );
}
export function invalidFFmpegError(ffPath: string) {
  invalidFFpathError(ffPath, "FFmpeg");
}
export function invalidFFprobeError(ffPath: string) {
  invalidFFpathError(ffPath, "FFprobe");
}

function missingFFpathError(binary: "FFmpeg" | "FFprobe"): void {
  dialog.showErrorBox(
    `${binary} path missing`,
    "Please download FFmpeg from https://ffmpeg.org/download.html and set in the menu",
  );
}
export function missingFFmpegError() {
  missingFFpathError("FFmpeg");
}
export function missingFFprobeError() {
  missingFFpathError("FFprobe");
}
