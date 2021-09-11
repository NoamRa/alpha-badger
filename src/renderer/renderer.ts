/** See exposed methods on preload.ts */

/* eslint-disable @typescript-eslint/ban-ts-comment */
const {
  runFFmpegCommand,
  receive,
  chooseFiles,
  chooseFolder,
  path,
  stopAll,
  // @ts-ignore // TODO find a way to import type 'AlphaBadgerApi'.
  // At the moment it fails on runtime even though 'import type' should disappear after compile
} = window.alphaBadgerApi;
/* eslint-enable */

// region files to render
const filePickerButton = document.getElementById("filePicker");
const clearFilesButton = document.getElementById("clearFiles");
const files = document.getElementById("files");
const filesManager = new Set<string>([]);
filePickerButton.addEventListener("click", async () => {
  const filePaths: string[] = await chooseFiles();
  if (filePaths.length === 0) {
    console.log("user canceled");
    return;
  }
  // Handle duplicate files is left to the UI
  filePaths.forEach((path: string) => {
    filesManager.add(path);
    const filePathEl = document.createElement("li");
    filePathEl.innerText = path;
    files.appendChild(filePathEl);
  });
});

clearFilesButton.addEventListener("click", async () => {
  filesManager.clear();
  files.innerHTML = "";
});
// endregion

// region destination folder
const folderPicker = document.getElementById("folderPicker");
const destinationFolderView = document.getElementById("destinationFolder");
let destinationFolder = "";
folderPicker.addEventListener("click", async () => {
  const folder: string | undefined = await chooseFolder();
  if (folder) {
    destinationFolder = folder;
    destinationFolderView.innerText = folder;
  }
});
// endregion

// region render
function buildCommand(input: string, outputDir: string): string {
  const destPath = path.join(outputDir, path.basename(input));
  return "".concat(
    `-i "${input}" `,
    `-filter_complex `.concat(
      `"`,
      `[0:v] split [paletteinput][vid];`,
      `[paletteinput] palettegen [palette];`,
      `[vid][palette] paletteuse`,
      `" `,
    ),
    `-y ${destPath}.gif`,
  );
}
const renderButton = document.getElementById("render");
renderButton.addEventListener("click", () => {
  const firstFile = [...filesManager][0];
  const command = buildCommand(firstFile, destinationFolder);
  console.log("renderer calling runFFmpegCommand\n", command);
  runFFmpegCommand(command);
});
// region events from rendering process

// region status
const statusEl: HTMLElement = document.getElementById("status");
receive("ffmpeg-error", (error: unknown) => {
  console.log("got error", error);
  statusEl.innerText = `Error \n${error}`;
});

receive("ffmpeg-start", (command: string) => {
  console.log("got start", command);
  statusEl.innerText = `Working...`;
});

receive("ffmpeg-end", () => {
  console.log("got end");
  statusEl.innerText = `Done`;
});

// region progress
const progressEl: HTMLElement = document.getElementById("progress");
receive("ffmpeg-progress", (progressStr: string) => {
  console.log("got progress", progressStr);
  if (progressStr) {
    const progress = JSON.parse(progressStr);
    const progressFrag = new DocumentFragment();
    Object.entries(progress).forEach(([key, value]) => {
      const progressInfo = document.createElement("li");
      progressInfo.innerText = `${key}: ${value}`;
      progressFrag.appendChild(progressInfo);
    });
    progressEl.innerText = "";
    progressEl.appendChild(progressFrag);
  }
});
// endregion

// region stop
const stopButton = document.getElementById("stop");
stopButton.addEventListener("click", () => {
  console.log("sending stop signal");
  stopAll();
});

receive("ffmpeg-codecData", (codecData: unknown) => {
  console.log("got codecData", codecData);
});
// endregion
