/** See exposed methods on preload.ts */

/* eslint-disable @typescript-eslint/ban-ts-ignore */
const {
  runFfmpegCommand,
  receive,
  chooseFiles,
  chooseFolder,
  path,
  // @ts-ignore
  // TODO find a way to import type 'AlphaBadgerApi'.
  // At the moment it fails on runtime even though 'import type' should dissapear after compile
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
  return `-i ${input} -y ${destPath}`;
}
const renderButton = document.getElementById("render");
renderButton.addEventListener("click", () => {
  const firstFile = [...filesManager][0];
  const command = buildCommand(firstFile, destinationFolder);
  console.log("renderer calling runFfmpegCommand\n", command);
  runFfmpegCommand(command);
});
// region events from rendering process

// region progress
const progressEl: HTMLSpanElement = document.getElementById("progress");
receive("ffmpeg-progress", (progressStr: string) => {
  console.log("got progress", progressStr);
  if (progressStr) {
    const progress = JSON.parse(progressStr);
    progressEl.textContent = "";
    Object.entries(progress).forEach(([key, value]) => {
      const progressInfo = document.createElement("li");
      progressInfo.innerText = `${key}: ${value}`;
      progressEl.appendChild(progressInfo);
    });
  }
});
// endregion

receive("ffmpeg-error", (error: unknown) => {
  console.log("got error", error);
});

receive("ffmpeg-start", (start: unknown) => {
  console.log("got start", start);
});

receive("ffmpeg-codecData", (codecData: unknown) => {
  console.log("got codecData", codecData);
});
// endregion
