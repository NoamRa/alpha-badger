import { useState, useMemo } from "react";

export type UseFolderPicker = {
  folder: string;
  openFolderPicker: () => Promise<void>;
};

export function useFolderPicker(): UseFolderPicker {
  const [folder, setFolder] = useState<string>("");

  const openFolderPicker = async () => {
    const folder: string | undefined = await alphaBadgerApi.chooseFolder();
    if (folder) {
      setFolder(folder);
    }
  };

  return { folder, openFolderPicker };
}
