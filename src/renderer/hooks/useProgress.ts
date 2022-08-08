import { useState } from "react";

type Progress = Record<string, string | number>;

export type UseProgress = {
  progress: Progress;
};

export function useProgress(): UseProgress {
  const [progress, setProgress] = useState({});

  alphaBadgerApi.receive("ffmpeg-progress", (progressStr: string) => {
    console.log("got progress", progressStr);
    if (progressStr) {
      const prog = JSON.parse(progressStr);
      setProgress(prog);
    }
  });

  return { progress };
}
