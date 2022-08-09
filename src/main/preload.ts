/**
 * This file serves as API between main process and renderers.
 */
import * as path from "path";
import { contextBridge, ipcRenderer } from "electron";

export type Listener = (...args: string[]) => void;

// #region listener manager
type ListenerId = number;
const getId: () => ListenerId = (() => {
  let id = 0;
  return () => {
    id += 1;
    return id;
  };
})();
const listeners: Record<ListenerId, { channel: string; listener: Listener }> =
  {};

const registerListener = (channel: string, listener: Listener) => {
  const id = getId();
  if (listeners[id]) {
    throw new Error(`trying to register listener on used address: ${id}`);
  }
  listeners[id] = { channel, listener };
  return id;
};

const removeListener = (id: ListenerId) => {
  const { channel, listener } = listeners[id];
  ipcRenderer.removeListener(channel, listener);
};
// #endregion

const listen = (channel: string, listener: Listener): ListenerId => {
  const id = registerListener(channel, listener);
  ipcRenderer.on(channel, (event, ...args) => listener(...args));
  return id;
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
    removeListener: typeof removeListener;
    runFFmpegCommand: typeof runFFmpegCommand;
    stopAll: typeof stopAll;
    readMetadata: typeof readMetadata;
    path: typeof path;
  };
};

export const alphaBadgerApi: AlphaBadgerApi["alphaBadgerApi"] = {
  chooseFiles,
  chooseFolder,
  listen,
  removeListener,
  runFFmpegCommand,
  stopAll,
  readMetadata,
  path,
};

// will be exposed on window.alphaBadgerApi
contextBridge.exposeInMainWorld("alphaBadgerApi", alphaBadgerApi);
