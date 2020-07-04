/**
 * This file serves as API between main process and renderers.
 */

import { contextBridge, ipcRenderer } from "electron";

type Listener = (...args: unknown[]) => unknown;
// type SendFn = (channel: string, data: unknown) => void;
// type ReciveFn = (channel: string, listener: Listener) => void;

const receive = (channel: string, listener: Listener): void => {
  ipcRenderer.on(channel, (event, ...args) => listener(...args));
};

const runFfmpegCommand = (command: string): void => {
  console.log("about to invoke command with", command);
  ipcRenderer.invoke("command", command);
};

const openFile = (
  filters: Electron.FileFilter[] = [{ name: "All Files", extensions: ["*"] }],
): Promise<void> => {
  return ipcRenderer.invoke("open-file", filters);
};

export type AlphaBadgerApi = {
  alphaBadgerApi: {
    openFile: () => void;
    receive: (channel: string, listener: Listener) => void;
    runFfmpegCommand: (command: string) => void;
  };
};

const alphaBadgerApi = {
  openFile,
  receive,
  runFfmpegCommand,
};

// will be exposed on window.alphaBadgerApi
contextBridge.exposeInMainWorld("alphaBadgerApi", alphaBadgerApi);
