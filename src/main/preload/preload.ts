/**
 * This file serves as API between main process and renderers.
 */
import * as path from "path";
import { contextBridge, ipcRenderer } from "electron";

import type {
  FFmpegCodecData,
  FFmpegEnd,
  FFmpegError,
  FFmpegProgress,
  FFmpegStart,
} from "../ffmpeg/types";
import type { Listener, ListenerId } from "./listenerManager";
import { addListener, removeListener } from "./listenerManager";

const onError = (listener: Listener<FFmpegError>): ListenerId =>
  addListener("ffmpeg-error", listener);

const onStart = (listener: Listener<FFmpegStart>): ListenerId =>
  addListener("ffmpeg-start", listener);

const onEnd = (listener: Listener<FFmpegEnd>): ListenerId =>
  addListener("ffmpeg-end", listener);

const onProgress = (listener: Listener<FFmpegProgress>): ListenerId =>
  addListener("ffmpeg-progress", listener);

const onData = (listener: Listener<FFmpegError>): ListenerId =>
  addListener("ffmpeg-data", listener);

const onCodecData = (listener: Listener<FFmpegCodecData>): ListenerId =>
  addListener("ffmpeg-codecData", listener);

const invokeRunFFmpegCommand = (command: string): void => {
  console.log("about to invoke command with", command);
  ipcRenderer.invoke("command", command);
};

const invokeReadMetadata = (filePath: string): Promise<string> => {
  return ipcRenderer.invoke("read-metadata", filePath);
};

const invokeStopAll = (): void => {
  console.log("about to stop all FFmpeg processes");
  ipcRenderer.invoke("stop-all");
};

const invokeChooseFiles = (
  filters: Electron.FileFilter[] = [{ name: "All Files", extensions: ["*"] }],
): Promise<string[]> => {
  return ipcRenderer.invoke("choose-files", filters);
};

const invokeChooseFolder = (): Promise<string | undefined> => {
  return ipcRenderer.invoke("choose-folder");
};

export const alphaBadgerApi = {
  // path utils
  path: path,

  // file and related
  chooseFiles: invokeChooseFiles,
  chooseFolder: invokeChooseFolder,

  // ffmpeg / ffprobe process
  readMetadata: invokeReadMetadata,
  runFFmpegCommand: invokeRunFFmpegCommand,
  stopAll: invokeStopAll,

  // listeners
  onError,
  onStart,
  onEnd,
  onProgress,
  onData,
  onCodecData,
  removeListener,
};

export type AlphaBadgerApi = {
  alphaBadgerApi: typeof alphaBadgerApi;
};

// will be exposed on window.alphaBadgerApi
contextBridge.exposeInMainWorld("alphaBadgerApi", alphaBadgerApi);
