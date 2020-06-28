import * as path from "path";
import * as fs from "fs-extra";
import { app, BrowserWindow, ipcMain } from "electron";
import { executeFfmpegCommand, Progress } from "./ffmpeg";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow: BrowserWindow;

const createWindow = (): void => {
  // Create the browser window.
  const preload: string = path.join(__dirname, "../main/preload.js");
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload,

      // region security
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      enableRemoteModule: false,
      contextIsolation: true,
      // endregion
    },
    show: false,
    height: 600,
    width: 800,
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  ["index.html", "index.css"].forEach((file: string) => {
    const src = path.join(__dirname, "../../src/renderer/" + file);
    const dist = path.join(__dirname, "../renderer/" + file);
    fs.copyFileSync(src, dist);
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  // TODO only on dev mode
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// TODO move to preload
ipcMain.handle("command", async (event, commandArguments: string) => {
  const options = {
    handleError: (error: string) => {
      mainWindow.webContents.send("ffmpeg-error", JSON.stringify(error));
    },
    handleStart: (commandLine: string) => {
      mainWindow.webContents.send("ffmpeg-start", JSON.stringify(commandLine));
    },
    handleProgress: (progress: Progress) => {
      mainWindow.webContents.send("ffmpeg-progress", JSON.stringify(progress));
    },
    handleCodecData: (data: unknown) => {
      mainWindow.webContents.send("ffmpeg-codecData", JSON.stringify(data));
    },
  };
  console.log("about to executeFfmpegCommand");
  executeFfmpegCommand(commandArguments, options);
});
