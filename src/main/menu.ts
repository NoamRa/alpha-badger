import { Menu, MenuItem } from "electron";
import { getFFmpegPath } from "./dialogs";
import { store } from "./config";

export function setAppMenu(): void {
  const menu = Menu.getApplicationMenu();

  menu.append(
    new MenuItem({
      label: "Set FFmpegPath",
      click(): void {
        const ffmpegPath = getFFmpegPath();
        if (ffmpegPath) {
          console.log(ffmpegPath);
          store.set("ffmpegPath", ffmpegPath);
          console.log("set ffmpegPath at", store.get("ffmpegPath"));
        }
      },
    }),
  );
  Menu.setApplicationMenu(menu);
}
