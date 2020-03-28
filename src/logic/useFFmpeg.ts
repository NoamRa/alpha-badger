import { useState, useCallback } from "react";
import { processVideo, calcNewPath, FileToProcess } from "./encoding";

function useFFmpeg() {
  const [error, setError] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentFile, setCurrentFile] = useState<string>("");

  const processVideos = useCallback(async (files: File[], doAlpha: boolean) => {
    const filesToProcess: FileToProcess[] = [];
    files.forEach(file => {
      filesToProcess.push({
        filePath: file.path,
        outputPath: calcNewPath(file.path),
        alpha: false
      });
      doAlpha &&
        filesToProcess.push({
          filePath: file.path,
          outputPath: calcNewPath(file.path, true),
          alpha: true
        });
    });

    for (const file of filesToProcess) {
      await processVideo({
        file: file,
        onStart: () => setCurrentFile(file.outputPath),
        onProgress: ({ percent }: any) => setProgress(Math.ceil(percent)),
        onError: err => setError(err)
      });
    }
  }, []);

  return {
    processVideos,
    error,
    progress,
    currentFile
  };
}

export default useFFmpeg;
