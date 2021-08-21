/**
 * This file serves as API between main process and renderers.
 */
import * as path from "path";
import { contextBridge, ipcRenderer } from "electron";

type Listener = (...args: unknown[]) => unknown;
// type SendFn = (channel: string, data: unknown) => void;
// type ReciveFn = (channel: string, listener: Listener) => void;

const receive = (channel: string, listener: Listener): void => {
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

export type AlphaBadgerApi = {
  alphaBadgerApi: {
    chooseFiles: typeof chooseFiles;
    chooseFolder: typeof chooseFolder;
    receive: typeof receive;
    runFFmpegCommand: typeof runFFmpegCommand;
    stopAll: typeof stopAll;
    path: typeof path;
  };
};

const alphaBadgerApi: AlphaBadgerApi["alphaBadgerApi"] = {
  chooseFiles,
  chooseFolder,
  receive,
  runFFmpegCommand,
  stopAll,
  path,
};

// will be exposed on window.alphaBadgerApi
contextBridge.exposeInMainWorld("alphaBadgerApi", alphaBadgerApi);
