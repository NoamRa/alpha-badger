import { useState } from "react";

export function useProgress() {
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
