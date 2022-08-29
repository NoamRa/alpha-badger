import { useState, useMemo } from "react";

type FilePath = string;

export type UseFilesPicker = {
  filePaths: FilePath[];
  openFilesPickerDialog: () => Promise<void>;
  clearFiles: () => void;
};

export function useFilesPicker(): UseFilesPicker {
  const [filePaths, setFiles] = useState<string[]>([]);

  const actions = useMemo(() => {
    const openFilesPickerDialog = async () => {
      const filePaths: string[] = await alphaBadgerApi.chooseFiles();
      if (filePaths.length === 0) {
        console.log("user canceled file selection");
        return;
      }
      setFiles(filePaths);
    };

    const clearFiles = () => {
      setFiles([]);
    };

    return {
      openFilesPickerDialog,
      clearFiles,
    };
  }, []);

  return { filePaths, ...actions };
}
