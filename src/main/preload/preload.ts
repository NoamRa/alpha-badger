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
import { Channel } from "./channels";

const onError = (listener: Listener<FFmpegError>): ListenerId =>
  addListener(Channel.FFmpeg.Error, listener);

const onStart = (listener: Listener<FFmpegStart>): ListenerId =>
  addListener(Channel.FFmpeg.Start, listener);

const onEnd = (listener: Listener<FFmpegEnd>): ListenerId =>
  addListener(Channel.FFmpeg.End, listener);

const onProgress = (listener: Listener<FFmpegProgress>): ListenerId =>
  addListener(Channel.FFmpeg.Progress, listener);

const onData = (listener: Listener<FFmpegError>): ListenerId =>
  addListener(Channel.FFmpeg.Data, listener);

const onCodecData = (listener: Listener<FFmpegCodecData>): ListenerId =>
  addListener(Channel.FFmpeg.CodecData, listener);

const invokeRunFFmpegCommand = (command: string): void => {
  console.log("about to invoke command with", command);
  ipcRenderer.invoke(Channel.Command, command);
};

const invokeReadMetadata = (filePath: string): Promise<string> => {
  return ipcRenderer.invoke(Channel.ReadMetadata, filePath);
};

const invokeStopAll = (): void => {
  console.log("about to stop all FFmpeg processes");
  ipcRenderer.invoke(Channel.StopAll);
};

const invokeChooseFiles = (
  filters: Electron.FileFilter[] = [{ name: "All Files", extensions: ["*"] }],
): Promise<string[]> => {
  return ipcRenderer.invoke(Channel.ChooseFiles, filters);
};

const invokeChooseFolder = (): Promise<string | undefined> => {
  return ipcRenderer.invoke(Channel.ChooseFolder);
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
