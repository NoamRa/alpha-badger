import { useState, useCallback } from "react";

export type UseFolderPicker = {
  folder: string;
  clearFolder: () => void;
  openFolderPicker: () => Promise<void>;
};

export function useFolderPicker(): UseFolderPicker {
  const [folder, setFolder] = useState<string>("");

  const openFolderPicker = useCallback(async () => {
    const folder: string | undefined = await alphaBadgerApi.chooseFolder();
    if (folder) {
      setFolder(folder);
    }
  }, []);

  const clearFolder = useCallback(() => setFolder(""), []);

  return { folder, openFolderPicker, clearFolder };
}
