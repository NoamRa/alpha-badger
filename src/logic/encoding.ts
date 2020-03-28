import path from "path";
import ffmpegStaticElectron from "ffmpeg-static-electron";
import ffmpeg from "fluent-ffmpeg";
import electron from "electron";

const app = electron.remote.app;

const p = path;
const ffse = ffmpegStaticElectron;
export const ffmpegPath = p.join(
  app.getAppPath(),
  "..",
  "node_modules",
  "ffmpeg-static-electron",
  ffse.path
);

ffmpeg.setFfmpegPath(ffmpegPath);

type AnyFn = (...args: any) => any;

const noop = () => {};

export type FileToProcess = {
  filePath: string;
  outputPath: string;
  alpha: boolean;
};

type ProcessVideoArgs = {
  file: FileToProcess;
  onStart?: AnyFn;
  onProgress?: AnyFn;
  onEnd?: AnyFn;
  onError?: AnyFn;
};

export function processVideo({
  file: { filePath, outputPath, alpha },
  onStart = noop,
  onProgress = noop,
  onEnd = noop,
  onError = noop
}: ProcessVideoArgs) {
  const outputOptionsParams: any = {
    r: "25",
    vcodec: "libx264",
    crf: "12",
    preset: "slow",
    pix_fmt: "yuv420p"
  };

  if (alpha) {
    outputOptionsParams.vf = "alphaextract";
  }

  const outputOptions: string[] = Object.entries(outputOptionsParams)
    .reduce((acc, curr) => (acc += `-${curr[0]} ${curr[1]} `), "")
    .trim()
    .split(" ");

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .on("error", (err, stdout, stderr) => {
        console.error("Error: " + err.message);
        console.error("ffmpeg output:\n" + stdout);
        console.error("ffmpeg stderr:\n" + stderr);
        onError(err);
        reject(err);
      })
      .on("start", commandLine => {
        console.log(
          `Start processing ${outputPath} with command:\n${commandLine}`
        );
        onStart();
      })
      .on("progress", progress => {
        console.log(progress);
        onProgress(progress);
      })
      .on("end", () => {
        console.log("Finished processing", outputPath);
        onEnd(outputPath);
        resolve();
      })
      .outputOptions(outputOptions)
      .output(outputPath)
      .run();
  });
}

export const calcNewPath = (
  filePath: string,
  alpha: boolean = false
): string => {
  const baseName = path.basename(filePath);
  const newName = alpha ? `${baseName}-alpha.mp4` : `${baseName}-regular.mp4`;
  return path.join(path.dirname(filePath), newName);
};
