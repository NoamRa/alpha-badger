import { useEffect, useState } from "react";

type Progress = Record<string, string | number>;

export type UseProgress = {
  progress: Progress;
};

export function useProgress(): UseProgress {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const progressId = alphaBadgerApi.onProgress((progress) => {
      if (progress) {
        const { id, ...prog } = progress;
        console.log(`got progress for id: ${id}`);
        console.log(prog);
        setProgress(prog);
      }
    });

    return () => {
      alphaBadgerApi.removeListener(progressId);
    };
  }, []);

  return { progress };
}
