import React from "react";
import { useFolderPicker } from "../../hooks/useFolderPicker";
import { useMetadata } from "./useMetadata";
import { renderFiles } from "./renderFiles";
import { Status } from "./Status";
import { FilesView } from "./FilesView";
import { Button } from "@blueprintjs/core";
import { useProgress } from "../../hooks/useProgress";
import { FFmpegStatus, useFFmpegStatus } from "../../hooks/useFFmpegStatus";

export function GifMaker(): JSX.Element {
  const { filesMeta, openFilePickerDialog, updateField, clearFiles } =
    useMetadata();

  const {
    folder: destinationFolder,
    openFolderPicker: openDestinationFolderPicker,
  } = useFolderPicker();

  const { status } = useFFmpegStatus();
  const { progress } = useProgress();

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
        <Button id="folderPicker" onClick={openDestinationFolderPicker}>
          Choose destination folder
        </Button>
        <span id="destinationFolder"> {destinationFolder}</span>
        {Object.keys(filesMeta).length > 0 && destinationFolder !== "" && (
          <ul>
            {Object.values(filesMeta).map((file) => (
              <li key={file.filePath}>
                {alphaBadgerApi.path.join(
                  destinationFolder,
                  alphaBadgerApi.path.basename(file.filePath),
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      <Button
        id="render"
        onClick={() => renderFiles(filesMeta, destinationFolder)}
      >
        Convert files to gifs
      </Button>
      {status === FFmpegStatus.Working && (
        <Button
          id="stop"
          onClick={() => {
            alphaBadgerApi.stopAll();
          }}
        >
          Stop
        </Button>
      )}
      <Status progress={progress} status={status} />
    </>
  );
}
