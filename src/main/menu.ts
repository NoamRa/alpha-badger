import type { MenuItemConstructorOptions } from "electron";
import { app, Menu, shell } from "electron";
import { promptFFmpegPath, promptFFprobePath } from "./dialogs";
import { store } from "./store";

const isMac = process.platform === "darwin";

export function setAppMenu(): void {
  const appMenu: MenuItemConstructorOptions = isMac
    ? {
        label: app.name,
        submenu: [
          { role: "about" },
          { type: "separator" },
          { role: "services" },
          { type: "separator" },
          { role: "hide" },
          { role: "hideOthers" },
          { role: "unhide" },
          { type: "separator" },
          { role: "quit" },
        ],
      }
    : {};

  const fileMenu: MenuItemConstructorOptions = {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  };

  const editMenu: MenuItemConstructorOptions = {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...((isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [
            { role: "delete" },
            { type: "separator" },
            { role: "selectAll" },
          ]) as MenuItemConstructorOptions[]),
    ],
  };

  const viewMenu: MenuItemConstructorOptions = {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  };

  const alphaBadgerMenu: MenuItemConstructorOptions = {
    label: "Alpha Badger",
    submenu: [
      {
        label: "Set FFmpeg Path",
        click: async () => {
          const ffmpegPath = await promptFFmpegPath();
          if (ffmpegPath) {
            console.log(ffmpegPath);
            store.set("ffmpegPath", ffmpegPath);
            console.log("set ffmpegPath at", store.get("ffmpegPath"));
          }
        },
      },
      {
        label: "Set FFprobe Path",
        click: async () => {
          const ffprobePath = await promptFFprobePath();
          if (ffprobePath) {
            console.log(ffprobePath);
            store.set("ffprobePath", ffprobePath);
            console.log("set ffprobePath at", store.get("ffprobePath"));
          }
        },
      },
    ],
  };

  const windowMenu: MenuItemConstructorOptions = {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...((isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]) as MenuItemConstructorOptions[]),
    ],
  };

  const helpMenu: MenuItemConstructorOptions = {
    role: "help",
    submenu: [
      {
        label: "Alpha Badger website",
        click: () => {
          shell.openExternal("https://github.com/NoamRa/alpha-badger");
        },
      },
    ],
  };

  const menu: Menu = Menu.buildFromTemplate(
    [
      appMenu,
      fileMenu,
      editMenu,
      viewMenu,
      alphaBadgerMenu,
      windowMenu,
      helpMenu,
    ].filter(menu => Boolean(menu) || Boolean(Object.keys(menu).length)),
  );
  Menu.setApplicationMenu(menu);
}
