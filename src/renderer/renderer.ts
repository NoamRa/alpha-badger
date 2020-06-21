/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

// import el from "electron";
// const x = el;

// const { dialog } = require("electron").remote;

// export function getFilesToRender(): void {
//   const files = dialog.showOpenDialog({
//     properties: ["openFile"],
//     title: "Add to render queue",
//     // filters: [{ name: "video files", extensions: ["mov"] }],// should be passed by template
//   });

//   if (!files) return;

//   console.log(files);
// }

const openAndToRenderButton = document.getElementById("render");
openAndToRenderButton.addEventListener("click", () => {
  alert("choose file");
});

console.log(
  '👋 This message is being logged by "renderer.js", included via webpack',
);
