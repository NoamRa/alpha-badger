import React from "react";
import { useFolderPicker } from "../../hooks/useFolderPicker";
import { useMetadata } from "./useMetadata";
import { renderFiles } from "./renderFiles";
import { Status } from "./Status";
import { FilesView } from "./FilesView";

export function GifMaker(): JSX.Element {
  const { filesMeta, openFilePickerDialog, updateField, clearFiles } =
    useMetadata();

  const {
    folder: destinationFolder,
    openFolderPicker: openDestinationFolderPicker,
  } = useFolderPicker();

  return (
    <>
      <h2>Video to gif maker</h2>
      <FilesView
        filesMeta={filesMeta}
        selectFiles={openFilePickerDialog}
        updateField={updateField}
        clearFilesList={clearFiles}
      />
      <section id="destination-folder">
        <button id="folderPicker" onClick={openDestinationFolderPicker}>
          Choose destination folder
        </button>
        <span id="destinationFolder">{destinationFolder}</span>
      </section>
      <button
        id="render"
        onClick={() => renderFiles(filesMeta, destinationFolder)}
      >
        render
      </button>
      <button
        id="stop"
        onClick={() => {
          alphaBadgerApi.stopAll();
        }}
      >
        stop
      </button>
      <Status />
    </>
  );
}
