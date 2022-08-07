import { useState } from "react";

export enum FFmpegStatus {
  "NotRunning" = "NotRunning",
  "Start" = "Start",
  "Error" = "Error",
  "End" = "End",
}

export type UseFFmpegStatus = {
  status: FFmpegStatus;
};

export function useFFmpegStatus(): UseFFmpegStatus {
  const [status, setStatus] = useState<FFmpegStatus>(FFmpegStatus.NotRunning);

  alphaBadgerApi.receive("ffmpeg-error", (error: unknown) => {
    console.log("got error", error);
    setStatus(FFmpegStatus.Error);
  });

  alphaBadgerApi.receive("ffmpeg-start", (command: string) => {
    console.log("got start", command);
    setStatus(FFmpegStatus.Start);
  });

  alphaBadgerApi.receive("ffmpeg-end", () => {
    console.log("got end");
    setStatus(FFmpegStatus.End);
  });

  return { status };
}
