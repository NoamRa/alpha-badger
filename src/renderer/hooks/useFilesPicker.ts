import { useState, useMemo } from "react";

type FilePath = string;

export type UseFilesPicker = {
  filePaths: FilePath[];
  openFilePickerDialog: () => Promise<void>;
  clearFiles: () => void;
};

export function useFilesPicker(): UseFilesPicker {
  const [filePaths, setFiles] = useState<string[]>([]);

  const actions = useMemo(() => {
    const openFilePickerDialog = async () => {
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
      openFilePickerDialog,
      clearFiles,
    };
  }, []);

  return { filePaths, ...actions };
}
