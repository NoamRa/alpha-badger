import fluentFFmpeg from "fluent-ffmpeg";
import { store } from "./config";

export type Progress = Record<string, string | number>;
function parseProgress(
  progressLine: string,
  callback?: (progress: Progress) => unknown,
): Progress {
  // Remove all spaces after = and trim.
  // each progress part is a key-value pai. ex: "frame=123", "time=01:23:45.67"
  const progressParts: string[] = progressLine
    .replace(/=\s+/g, "=")
    .trim()
    .split(" ");

  // build progress object
  const progress: Progress = {};
  for (const keyValuePair of progressParts) {
    const [key, value] = keyValuePair.split("=", 2).map((v) => v.trim());
    if (typeof value === "undefined") return null;
    const valueAsNumber = +value;
    progress[key] = !Number.isNaN(valueAsNumber) ? valueAsNumber : value;
  }

  // do something with progress object
  // console.log(progress);
  if (typeof callback === "function") {
    callback(progress);
  }
  return progress;
}

function wrapFluentFfmpegCommand(
  ffmpegPath: string,
  commandArguments: string,
): fluentFFmpeg.FfmpegCommand {
  // inspired by https://stackoverflow.com/a/59899403/4205578

  const command = fluentFFmpeg().output(" "); // pass "Invalid output" validation

  command.setFfmpegPath(ffmpegPath);

  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore accessing private _outputs
  const outsput = command._outputs[0];
  outsput.isFile = false; // disable adding "-y" argument
  outsput.target = ""; // bypass "Unable to find a suitable output format for ' '"
  // @ts-ignore overriging private _global
  command._global.get = (): string[] => {
    // append custom arguments
    return commandArguments.split(" ");
  };
  /* eslint-enable */
  return command;
}

export type FfmpegCommandOptions = {
  handleError: (err: string) => void;
  handleStart: (commandLine: string) => void;
  handleProgress: (progress: Progress) => void;
  handleCodecData: (data: unknown) => void;
};

export function executeFfmpegCommand(
  command: string,
  options: FfmpegCommandOptions,
): void {
  try {
    const ffmpegCommand = wrapFluentFfmpegCommand(
      store.get("ffmpegPath") as string,
      command,
    );
    ffmpegCommand
      .on("error", options.handleError)
      .on("start", options.handleStart)
      .on("codecData", options.handleCodecData)
      .on("stderr", (progress: string) =>
        parseProgress(progress, options.handleProgress),
      );
    return ffmpegCommand.run();
  } catch (err) {
    console.log("executeFfmpegCommand0 error", err);
    throw new Error(err);
  }
}
