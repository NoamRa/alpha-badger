import type { ID, Process } from "./types";

export enum Status {
  Initial,
  Running,
  Stopped,
}
export enum Reason {
  Initial,
  Working,
  Error,
  Done,
}

export type FFmpegProcess = {
  id: ID;
  command: string;
  process: Process;
  status: Status;
  reason: Reason;
};

export type ProcessManager = {
  add: (command: string, process: Process) => ID;
  get: (id: ID) => FFmpegProcess;
  remove: (id: ID) => void;
  setStatus: (id: ID, status: Status) => void;
  setReason: (id: ID, reason: Reason) => void;
  getIds: () => ID[];
};

export function processManager(): ProcessManager {
  const getId: () => ID = (() => {
    let id = 0;
    return () => {
      id += 1;
      return id;
    };
  })();

  const _ffmpegProcesses = new Map<ID, FFmpegProcess>();

  const add = (command: string, process: Process): ID => {
    const id = getId();
    _ffmpegProcesses.set(id, {
      id,
      command,
      process,
      status: Status.Initial,
      reason: Reason.Initial,
    });
    return id;
  };

  const get = (id: ID): FFmpegProcess => {
    return _ffmpegProcesses.get(id)!;
  };

  const remove = (id: ID): void => {
    _ffmpegProcesses.delete(id);
  };

  const setStatus = (id: ID, status: Status) => {
    get(id).status = status;
  };

  const setReason = (id: ID, reason: Reason) => {
    get(id).reason = reason;
  };

  const getIds = (): ID[] => {
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
