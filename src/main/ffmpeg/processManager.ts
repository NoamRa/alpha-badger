import type { ChildProcess } from "node:child_process";
import { genShortId } from "../utils/generateId";

export enum Status {
  Initial,
  Running,
  Stopped,
}
export enum Reason {
  Initial = "Initial",
  Working = "Working",
  Error = "Error",
  Done = "Done",
}

export type FFmpegProcess = {
  id: FFmpegId;
  command: string;
  process: ChildProcess;
  status: Status;
  reason: Reason;
};

export type ProcessManager = {
  add: (command: string, process: ChildProcess) => FFmpegId;
  get: (id: FFmpegId) => FFmpegProcess;
  remove: (id: FFmpegId) => void;
  setStatus: (id: FFmpegId, status: Status) => void;
  setReason: (id: FFmpegId, reason: Reason) => void;
  getIds: () => FFmpegId[];
};

export function processManager(): ProcessManager {
  const _ffmpegProcesses = new Map<FFmpegId, FFmpegProcess>();

  const add = (command: string, process: ChildProcess): FFmpegId => {
    const id = genShortId("ffmpeg");
    _ffmpegProcesses.set(id, {
      id,
      command,
      process,
      status: Status.Initial,
      reason: Reason.Initial,
    });
    return id;
  };

  const get = (id: FFmpegId): FFmpegProcess => {
    const proc = _ffmpegProcesses.get(id);
    if (proc === undefined) {
      throw new Error(
        `FFmpeg process manager failed to find process with id ${id}`,
      );
    }
    return proc;
  };

  const remove = (id: FFmpegId): void => {
    _ffmpegProcesses.delete(id);
  };

  const setStatus = (id: FFmpegId, status: Status) => {
    get(id).status = status;
  };

  const setReason = (id: FFmpegId, reason: Reason) => {
    get(id).reason = reason;
  };

  const getIds = (): FFmpegId[] => {
    return [..._ffmpegProcesses.keys()];
  };

  return {
    add,
    get,
    remove,
    setStatus,
    setReason,
    getIds,
  };
}
