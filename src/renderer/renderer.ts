/** See exposed functions on preload.ts */
// @ts-ignore
const { runFfmpegCommand, receive } = window.alphaBadgerApi;

const openAndToRenderButton = document.getElementById("render");
const progressEl: HTMLSpanElement = document.getElementById("progress");

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

console.log("👋 This message is being logged by 'renderer.js'");
