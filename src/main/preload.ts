/**
 * This file serves as API between main process and renderers.
 */
import * as path from "path";
import { contextBridge, ipcRenderer } from "electron";

type Listener = (...args: unknown[]) => unknown;

const listen = (channel: string, listener: Listener): void => {
  ipcRenderer.on(channel, (event, ...args) => listener(...args));
};

const runFFmpegCommand = (command: string): void => {
  console.log("about to invoke command with", command);
  ipcRenderer.invoke("command", command);
};

const stopAll = (): void => {
  console.log("about to stop all FFmpeg processes");
  ipcRenderer.invoke("stop-all");
};

const chooseFiles = (
  filters: Electron.FileFilter[] = [{ name: "All Files", extensions: ["*"] }],
): Promise<string[]> => {
  return ipcRenderer.invoke("choose-files", filters);
};

const chooseFolder = (): Promise<string | undefined> => {
  return ipcRenderer.invoke("choose-folder");
};

const readMetadata = (filePath: string): Promise<string> => {
  return ipcRenderer.invoke("read-metadata", filePath);
};

export type AlphaBadgerApi = {
  alphaBadgerApi: {
    chooseFiles: typeof chooseFiles;
    chooseFolder: typeof chooseFolder;
    listen: typeof listen;
    runFFmpegCommand: typeof runFFmpegCommand;
    stopAll: typeof stopAll;
    readMetadata: typeof readMetadata;
    path: typeof path;
  };
};

const alphaBadgerApi: AlphaBadgerApi["alphaBadgerApi"] = {
  chooseFiles,
  chooseFolder,
  listen,
  runFFmpegCommand,
  stopAll,
  readMetadata,
  path,
};

// will be exposed on window.alphaBadgerApi
contextBridge.exposeInMainWorld("alphaBadgerApi", alphaBadgerApi);
