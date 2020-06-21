import { dialog } from "electron";

export function getFilesToRender(): void {
  const files = dialog.showOpenDialog({
    properties: ["openFile"],
    title: "Add to render queue",

    // filters: [{ name: "video files", extensions: ["mov"] }],// should be passed by template
  });

  if (!files) return;

  console.log(files);
}

console.log("loaded dialogs");
