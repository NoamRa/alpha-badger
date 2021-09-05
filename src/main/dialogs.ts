import { dialog } from "electron";
import { validateFFmpeg } from "./ffmpeg/validateFFmpeg";

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
    invalidFFmpegError(filePaths[0]);
    return undefined;
  }
}

export function invalidFFmpegError(ffmpegPath: string): void {
  dialog.showErrorBox(
    "Failed to open FFmpeg executable",
    "The file at\n" +
      ffmpegPath +
      "\nis not an FFmpeg executable. " +
      "\nPlease download from https://ffmpeg.org/download.html and choose again",
  );
}

export function missingFFmpegError(): void {
  dialog.showErrorBox(
    "FFmpeg path missing",
    "Please download FFmpeg from https://ffmpeg.org/download.html and set in the menu",
  );
}
