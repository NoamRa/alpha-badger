declare const alphaBadgerApi: typeof import("./preload/preload").alphaBadgerApi;

declare type FFmpegId = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type WithFFmpegId<T extends Record<string, any>> = T & {
  id: FFmpegId;
};

declare type FFprobeJSON = import("./ffmpeg/types").FFprobeJSON;
