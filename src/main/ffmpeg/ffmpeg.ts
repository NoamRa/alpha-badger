import fluentFFmpeg from "fluent-ffmpeg";
import { Progress, parseProgress } from "./ffmpegUtils";
import { processManager, Reason, Status } from "./processManager";
import type { FFmpegProcess } from "./processManager";
import { store } from "../config";

export const procManager = processManager();

function wrapFluentFfmpegCommand(
  ffmpegPath: string,
  commandArguments: string,
): fluentFFmpeg.FfmpegCommand {
  // inspired by https://stackoverflow.com/a/59899403/4205578

  const command = fluentFFmpeg().output(" "); // pass "Invalid output" validation

  command.setFfmpegPath(ffmpegPath);

  /* eslint-disable @typescript-eslint/ban-ts-comment */
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

export function executeFFmpegCommand(
  command: string,
  options: FfmpegCommandOptions,
): void {
  try {
    const ffmpegCommand = wrapFluentFfmpegCommand(
      store.get("ffmpegPath") as string,
      command,
    );
    const id = procManager.add(command, ffmpegCommand);

    ffmpegCommand
      .on("error", (error: string) => {
        options.handleError(error);
        procManager.setStatus(id, Status.Stopped);
        procManager.setReason(id, Reason.Error);
      })
      .on("start", (commandLine: string) => {
        options.handleStart(commandLine);
        procManager.setStatus(id, Status.Running);
      })
      .on("codecData", options.handleCodecData)
      .on("stderr", (progress: string) =>
        // FFmpeg reports process on stderr 🤷🏽‍♀️
        parseProgress(progress, options.handleProgress),
      );
    return ffmpegCommand.run();
  } catch (err) {
    console.log("executeFFmpegCommand error", err);
    throw new Error(err);
  }
}

function stop(id: FFmpegProcess["id"]): void {
  const process = procManager.get(id).process;
  process.kill();
}

export function stopAll(): void {
  procManager.getIds().forEach(stop);
}
