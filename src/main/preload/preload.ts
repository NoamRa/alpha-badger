/**
 * This file serves as API between main process and renderers.
 */
import path from "node:path";
import { contextBridge, ipcRenderer, shell } from "electron";

import type {
  FFmpegCodecData,
  FFmpegData,
  FFmpegEnd,
  FFmpegError,
  FFmpegProgress,
  FFmpegStart,
  FFprobeJSON,
} from "../ffmpeg/types";
import type { Listener, ListenerId } from "./listenerManager";
import { addListener, removeListener } from "./listenerManager";
import { Channel } from "./channels";
import { store } from "../store";

const onError = (listener: Listener<FFmpegError>): ListenerId =>
  addListener(Channel.FFmpeg.Error, listener);

const onStart = (listener: Listener<FFmpegStart>): ListenerId =>
  addListener(Channel.FFmpeg.Start, listener);

const onEnd = (listener: Listener<FFmpegEnd>): ListenerId =>
  addListener(Channel.FFmpeg.End, listener);

const onProgress = (listener: Listener<FFmpegProgress>): ListenerId =>
  addListener(Channel.FFmpeg.Progress, listener);

const onData = (listener: Listener<FFmpegData>): ListenerId =>
  addListener(Channel.FFmpeg.Data, listener);

const onCodecData = (listener: Listener<FFmpegCodecData>): ListenerId =>
  addListener(Channel.FFmpeg.CodecData, listener);

const invokeRunFFmpegCommand = (command: string): void => {
  console.log("about to invoke command with", command);
  ipcRenderer.invoke(Channel.Command, command);
};

const invokeReadMetadata = (filePath: string): Promise<FFprobeJSON> => {
  return ipcRenderer.invoke(Channel.ReadMetadata, filePath);
};

const invokeStopAll = (): void => {
  console.log("about to stop all FFmpeg processes");
  ipcRenderer.invoke(Channel.StopAll);
};

const invokeChooseFile = (
  filters: Electron.FileFilter[] = [{ name: "All Files", extensions: ["*"] }],
): Promise<string> => {
  return ipcRenderer.invoke(Channel.ChooseFile, filters);
};

const invokeChooseFiles = (
  filters: Electron.FileFilter[] = [{ name: "All Files", extensions: ["*"] }],
): Promise<string[]> => {
  return ipcRenderer.invoke(Channel.ChooseFiles, filters);
};

const invokeChooseFolder = (): Promise<string | undefined> => {
  return ipcRenderer.invoke(Channel.ChooseFolder);
};

const openExternal = (url: string) => {
  // intentionally very restrictive use of openExternal
  const allowedProtocols = new Set(["https:", "mailto:"]);
  if (allowedProtocols.has(new URL(url).protocol)) {
    shell.openExternal(url);
  } else {
    console.log(
      `Opening external app was blocked due to disallowed protocol. The allowed protocols are ${[
        ...allowedProtocols,
      ].join(", ")}`,
    );
  }
};

export const alphaBadgerApi = {
  // utils
  path: path,
  openExternal,

  // file and related
  chooseFile: invokeChooseFile,
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

  // preset
  getSelectedPresetIndex: store.getSelectedPresetIndex,
  setSelectedPresetIndex: store.setSelectedPresetIndex,
};

export type AlphaBadgerApi = {
  alphaBadgerApi: typeof alphaBadgerApi;
};

// will be exposed on window.alphaBadgerApi
contextBridge.exposeInMainWorld("alphaBadgerApi", alphaBadgerApi);
