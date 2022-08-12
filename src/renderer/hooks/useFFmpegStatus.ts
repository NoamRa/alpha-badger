import { useEffect, useState } from "react";

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

  useEffect(() => {
    const errorId = alphaBadgerApi.onError((error) => {
      console.log(
        `got error for id: ${error.id}, error: ${JSON.stringify(error)}`,
      );
      setStatus(FFmpegStatus.Error);
    });
    const startId = alphaBadgerApi.onStart(({ id, command }) => {
      console.log(`got start for id: ${id}, command: ${command}`);
      setStatus(FFmpegStatus.Working);
    });

    const endId = alphaBadgerApi.onEnd(({ id, reason }) => {
      console.log(`got end for id: ${id}, reason: ${reason}`);
      setStatus(FFmpegStatus.Ended);
    });

    return () => {
      alphaBadgerApi.removeListener(errorId);
      alphaBadgerApi.removeListener(startId);
      alphaBadgerApi.removeListener(endId);
    };
  }, []);

  return { status };
}
