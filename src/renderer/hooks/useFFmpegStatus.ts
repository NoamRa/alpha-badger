import { useState } from "react";

export enum FFmpegStatus {
  "NotRunning" = "NotRunning",
  "Working" = "Working",
  "Error" = "Error",
  "Ended" = "Ended",
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
    setStatus(FFmpegStatus.Working);
  });

  alphaBadgerApi.receive("ffmpeg-end", () => {
    console.log("got end");
    setStatus(FFmpegStatus.Ended);
  });

  return { status };
}
