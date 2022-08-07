import React from "react";
import { NumericInput } from "./NumericInput";
import type { UseMetadata } from "./useMetadata";

type FilesPickerProps = {
  filesMeta: UseMetadata["filesMeta"];
  selectFiles: UseMetadata["openFilePickerDialog"];
  updateField: UseMetadata["updateField"];
  clearFilesList: UseMetadata["clearFiles"];
};

export function FilesView({
  filesMeta,
  selectFiles,
  updateField,
  clearFilesList,
}: FilesPickerProps) {
  return (
    <section id="files to use">
      <div>
        <button id="filePicker" onClick={selectFiles}>
          choose file
        </button>
        <button id="clearFiles" onClick={clearFilesList}>
          clear file list
        </button>
      </div>
      <ul id="files">
        {Object.values(filesMeta).map((file) => (
          <li key={file.filePath}>
            {file.filePath}{" "}
            <NumericInput
              id={file.filePath}
              name={"width"}
              value={file.desiredWidth}
              max={file.width}
              onChange={(desiredWidth) => {
                updateField(file.filePath, "desiredWidth", desiredWidth);
              }}
            />
            <NumericInput
              id={file.filePath}
              name={"Frames per second"}
              value={file.desiredFps}
              max={file.fps}
              onChange={(desiredFps) => {
                updateField(file.filePath, "desiredFps", desiredFps);
              }}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
