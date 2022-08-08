import React from "react";
import { Button, NumericInput } from "@blueprintjs/core";
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
        <Button id="filePicker" onClick={selectFiles}>
          choose file
        </Button>
        <Button id="clearFiles" onClick={clearFilesList}>
          clear file list
        </Button>
      </div>
      <ul id="files">
        {Object.values(filesMeta).map((file) => (
          <li key={file.filePath}>
            {file.filePath}{" "}
            <ul>
              <li>
                Width:
                <NumericInput
                  id={file.filePath}
                  name={"width"}
                  value={file.desiredWidth}
                  max={file.width}
                  placeholder="Enter desired width..."
                  onValueChange={(desiredWidth) => {
                    updateField(
                      file.filePath,
                      "desiredWidth",
                      Math.round(desiredWidth),
                    );
                  }}
                  minorStepSize={1}
                />
              </li>
              <li>
                Frames per second:
                <NumericInput
                  id={file.filePath}
                  name={"Frames per second"}
                  value={file.desiredFps}
                  max={file.fps}
                  placeholder="Enter desired fps..."
                  onValueChange={(desiredFps) => {
                    updateField(
                      file.filePath,
                      "desiredFps",
                      Math.round(desiredFps),
                    );
                  }}
                />
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
