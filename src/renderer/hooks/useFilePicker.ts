import { useState, useMemo } from "react";

export type UseFilePicker = {
  filePath: string;
  openFilePickerDialog: () => Promise<void>;
  clearFile: () => void;
};

export function useFilePicker(): UseFilePicker {
  const [filePath, setFilePath] = useState<string>("");

  const actions = useMemo(() => {
    const openFilePickerDialog = async () => {
      const filePath: string = await alphaBadgerApi.chooseFile();
      if (!filePath || filePath === "") {
        console.log("user canceled file selection");
        return;
      }
      setFilePath(filePath);
    };

    const clearFile = () => {
      setFilePath("");
    };

    return {
      openFilePickerDialog,
      clearFile,
    };
  }, []);

  return { filePath, ...actions };
}
