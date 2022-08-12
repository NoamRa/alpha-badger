import React from "react";
import { Button } from "@blueprintjs/core";
import type { UseMetadata } from "../hooks/useMetadata";
import { FileView } from "./FileView";

type FilesPickerProps = {
  filesMeta: UseMetadata["filesMeta"];
  loading: UseMetadata["loading"];
  selectFiles: UseMetadata["openFilePickerDialog"];
  updateField: UseMetadata["updateField"];
  clearFilesList: UseMetadata["clearFiles"];
};

export function FilesView({
  filesMeta,
  loading,
  selectFiles,
  updateField,
  clearFilesList,
}: FilesPickerProps) {
  const files = Object.values(filesMeta);

  return (
    <section id="files">
      <h5>Step 1 - Choose video files</h5>
      <Button onClick={selectFiles}>Choose file(s)</Button>
      {loading && <div>loading...</div>}
      {files.length > 0 && (
        <>
          <ul id="fileList">
            {files.map((file) => (
              <FileView
                key={file.filePath}
                file={file}
                updateField={updateField}
              />
            ))}
          </ul>
          <Button id="clearFiles" onClick={clearFilesList}>
            Clear file list
          </Button>
        </>
      )}
    </section>
  );
}
