export type ID = number;
export type Process = any; // TODO

export type Progress = Record<string, string | number>;
export type FFmpegError = {
  id: ID;
  message: string;
  command: string;
  stack?: string;
};

export type FFmpegCommandHandlers = {
  handleError: (err: FFmpegError) => void;
  handleStart: (commandLine: string) => void;
  handleEnd: () => void;
  handleProgress: (progress: Progress) => void;
  handleCodecData: (data: unknown) => void;
  handleData: (data: string) => void;
};
