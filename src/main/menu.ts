import { Menu, MenuItem } from "electron";
import { promptFFmpegPath } from "./dialogs";
import { store } from "./store";

export function setAppMenu(): void {
  const menu = Menu.getApplicationMenu();

  menu.append(
    new MenuItem({
      label: "Set FFmpeg Path",
      async click(): Promise<void> {
        const ffmpegPath = await promptFFmpegPath();
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
