import { exec } from "child_process";
import { invalidFFmpegError, missingFFmpegError } from "../dialogs";
import { store } from "../store";
import type { FFmpegError, FFmpegCommandHandlers } from "./types";
import type { FFmpegProcess } from "./processManager";
import { parseProgress } from "./parseProgress";
import { processManager, Reason, Status } from "./processManager";
import { validateFFmpeg } from "./validateFFpath";

export const procManager = processManager();

export async function executeFFmpegCommand(
  command: string,
  handlers: FFmpegCommandHandlers,
): Promise<void> {
  const ffmpegPath = store.getFFmpegPath();
  if (!ffmpegPath) {
    handlers.handleError({
      id: "-1",
      message: "FFmpeg path is not set",
      command,
    });
    missingFFmpegError();
  }

  if (!(await validateFFmpeg(ffmpegPath))) {
    handlers.handleError({
      id: "-2",
      message: "Invalid FFmpeg executable",
      command,
    });
    invalidFFmpegError(ffmpegPath);
  }

  const ffmpegCommand = `${ffmpegPath} ${command}`;

  const ffmpeg = exec(ffmpegCommand);

  const id = procManager.add(command, ffmpeg);

  // handle start
  handlers.handleStart({ id, command: ffmpegCommand });
  procManager.setStatus(id, Status.Running);

  ffmpeg.on("error", (error: unknown) => {
    const ffmpegError: FFmpegError = {
      id,
      command,
      message: "something went wrong",
    };
    if (error instanceof Error) {
      ffmpegError.message = error.message;
      ffmpegError.stack = error.stack;
    } else if (typeof error === "string") {
      ffmpegError.message = error;
    }

    handlers.handleError(ffmpegError);
    procManager.setStatus(id, Status.Stopped);
    procManager.setReason(id, Reason.Error);
  });

  ffmpeg.on("exit", (status: number | null, signal: "SIGTERM" | null) => {
    if (status === 0) {
      procManager.setStatus(id, Status.Stopped);
      procManager.setReason(id, Reason.Done);
    } else if (signal === "SIGTERM") {
      procManager.setStatus(id, Status.Stopped);
      procManager.setReason(id, Reason.Error);
    }
    handlers.handleEnd({ id, reason: procManager.get(id).reason });
  });

  let inCodecData = false;
  let codecData = "";
  // FFmpeg reports process on stderr 🤷🏽‍♀️
  ffmpeg.stderr!.on("data", (data) => {
    // raw data, always pushed
    handlers.handleData(data);

    // accumulate and handle codec data
    // TODO see https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/blob/68d5c948b689b3058e52435e0bc3d4af0eee349e/lib/utils.js#L275
    // start accumulating
    if (data.includes("Input #")) {
      inCodecData = true;
    }
    // stop
    if (data.includes("Press [")) {
      inCodecData = false;
      handlers.handleCodecData({ id, codecData });
    }
    if (inCodecData) {
      codecData += data;
    }

    // progress
    if (data.includes("frame=")) {
      handlers.handleProgress({ id, progress: parseProgress(data) });
    }
  });
}

function stop(id: FFmpegProcess["id"]): void {
  const process = procManager.get(id).process;
  process.kill("SIGTERM");
}

export function stopAll(): void {
  procManager.getIds().forEach((id) => stop(id));
}
