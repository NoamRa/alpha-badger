/** See exposed methods on preload.ts */

// @ts-ignore
const { runFfmpegCommand, receive, openFile } = window.alphaBadgerApi;

const filePickerButton = document.getElementById("filePicker");
const clearFilesButton = document.getElementById("clearFiles");
const files = document.getElementById("files");
const openAndToRenderButton = document.getElementById("render");
const progressEl: HTMLSpanElement = document.getElementById("progress");

filePickerButton.addEventListener("click", async () => {
  const filePaths: string[] = await openFile();
  if (filePaths.length === 0) {
    console.log("user canceled");
    return;
  }
  // Handle duplicate files is left to the UI
  filePaths.forEach((path: string) => {
    const filePathEl = document.createElement("li");
    filePathEl.innerText = path;
    files.appendChild(filePathEl);
  });
});

clearFilesButton.addEventListener("click", async () => {
  files.innerHTML = "";
});

openAndToRenderButton.addEventListener("click", () => {
  console.log("renderer calling runFfmpegCommand");
  const command =
    "-i F:\\Talking.Heads.Stop.Making.Sense.1984.720p.BluRay.DTS.x264-EbP.mkv -y F:\\test.mp4";
  runFfmpegCommand(command);
});

receive("ffmpeg-progress", (progress: unknown) => {
  console.log("got progress", progress);
  progressEl.textContent = JSON.stringify(progress);
});

receive("ffmpeg-error", (error: unknown) => {
  console.log("got error", error);
});

receive("ffmpeg-start", (start: unknown) => {
  console.log("got start", start);
});

receive("ffmpeg-codecData", (codecData: unknown) => {
  console.log("got codecData", codecData);
});
