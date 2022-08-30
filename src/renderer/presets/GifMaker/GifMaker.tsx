import React from "react";
import {
  useFolderPicker,
  useCodecData,
  useFFmpegStatus,
  FFmpegStatus,
  useProgress,
} from "../../hooks";
import { useMetadata } from "./hooks/useMetadata";
import { calcDestPath, renderFiles } from "./logic/renderFiles";
import { Status } from "../../components/Status";
import { FilesView } from "./components/FilesView";
import { Button } from "@blueprintjs/core";

export function GifMaker(): JSX.Element {
  const { filesMeta, loading, openFilesPickerDialog, updateField, clearFiles } =
    useMetadata();

  const {
    folder: destinationFolder,
    openFolderPicker: openDestinationFolderPicker,
  } = useFolderPicker();

  const { status } = useFFmpegStatus();
  useProgress(); // subscribe to progress events
  useCodecData(); // subscribe to codec data events

  const handleRender = () => {
    if (loading) {
      alert("Still loading files");
      return;
    }
    if (Object.keys(filesMeta).length < 1) {
      alert("Please choose files");
      return;
    }
    if (destinationFolder === "") {
      alert("Please choose destination folder");
      return;
    }
    if (status === FFmpegStatus.Working) {
      alert(
        "There's conversion in progress. Please wait for process to finish or stop the process",
      );
      return;
    }
    renderFiles(filesMeta, destinationFolder);
  };

  return (
    <main>
      <h2>Video to gif maker</h2>
      <FilesView
        filesMeta={filesMeta}
        loading={loading}
        selectFiles={openFilesPickerDialog}
        updateField={updateField}
        clearFilesList={clearFiles}
      />
      <section id="destination">
        <h5>Step 2 - Choose destination folder</h5>
        <Button id="folderPicker" onClick={openDestinationFolderPicker}>
          Choose destination folder
        </Button>
        <div>
          {destinationFolder && (
            <>
              <br />
              {destinationFolder}
            </>
          )}

          {Object.keys(filesMeta).length > 0 && destinationFolder !== "" && (
            <ul>
              {Object.values(filesMeta).map((file) => (
                <li key={file.filePath}>
                  {calcDestPath(destinationFolder, file.filePath)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <section id="convert">
        <h5>Step 3 - Start conversion</h5>
        <Button id="render" onClick={handleRender}>
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
        <Status status={status} />
      </section>
    </main>
  );
}
