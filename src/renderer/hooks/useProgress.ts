import { useEffect, useState } from "react";

type Progress = Record<string, string | number>;

export type UseProgress = {
  progress: Progress;
};

export function useProgress(): UseProgress {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const progressId = alphaBadgerApi.onProgress((progressData) => {
      const { id, progress } = progressData;
      console.log(`got progress for id: ${id}`);
      console.log(progress);
      setProgress(progress);
    });

    return () => {
      alphaBadgerApi.removeListener(progressId);
    };
  }, []);

  return { progress };
}
