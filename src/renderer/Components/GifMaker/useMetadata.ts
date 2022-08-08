import { useEffect, useState } from "react";
import { useFilesPicker } from "../../hooks/useFilesPicker";

type FFprobeJSON = {
  streams: Array<{
    codec_type: string;
    width: number;
    r_frame_rate: string;
  }>;
};

export type FileMeta = {
  filePath: string;
  r_frame_rate: string;
  fps: number;
  width: number;
  desiredFps: number;
  desiredWidth: number;
};

export type FilesMetadata = Record<string, FileMeta>;

export type UseMetadata = {
  filesMeta: FilesMetadata;
  openFilePickerDialog: () => Promise<void>;
  updateField: <K extends keyof FileMeta>(
    filePath: string,
    key: K,
    value: FileMeta[K],
  ) => void;
  clearFiles: () => void;
};

export function useMetadata(): UseMetadata {
  const { filePaths, openFilePickerDialog, clearFiles } = useFilesPicker();
  const [filesMeta, setFilesMeta] = useState<FilesMetadata>({});

  useEffect(() => {
    async function readFilesMetadata(filePaths: string[]) {
      for (const filePath of filePaths) {
        const metadata: FFprobeJSON = JSON.parse(
          await alphaBadgerApi.readMetadata(filePath),
        );
        const videoStream = metadata?.streams?.find(
          (stream) => stream?.codec_type === "video",
        );
        if (!videoStream) {
          continue;
        }
        const { width, r_frame_rate } = videoStream;
        const [numerator, denominator] = r_frame_rate.split("/").map((n) => +n);
        const fps = Math.round(numerator / denominator);

        setFilesMeta((prevFilesMeta) => ({
          ...prevFilesMeta,
          [filePath]: {
            filePath,
            width,
            r_frame_rate,
            fps,
            desiredWidth: width,
            desiredFps: fps,
          },
        }));
      }
    }

    readFilesMetadata(filePaths);
  }, [filePaths]);

  const updateField = <K extends keyof FileMeta>(
    filePath: string,
    key: K,
    value: FileMeta[K],
  ) => {
    setFilesMeta((prevFilesMeta) => {
      const clone = structuredClone(prevFilesMeta);
      const fileMeta = clone[filePath];
      fileMeta[key] = value;
      return clone;
    });
  };

  return {
    filesMeta,
    openFilePickerDialog,
    updateField,
    clearFiles: () => {
      clearFiles();
      setFilesMeta({});
    },
  };
}
