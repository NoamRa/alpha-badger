import React from "react";
import { Button } from "@blueprintjs/core";
import { FilePicker } from "../../components/FilePicker";
import { Status } from "../../components/Status";
import { PresetMain } from "../../components/PresetMain";
import {
  FFmpegStatus,
  useFolderPicker,
  useFilePicker,
  useFFmpegStatus,
  useProgress,
  useCodecData,
} from "../../hooks";
import { compare } from "./logic/renderFiles";

export function CompareVideos() {
  const { status } = useFFmpegStatus();
  useProgress(); // subscribe to progress events
  useCodecData(); // subscribe to codec data events

  const {
    filePath: baseline,
    openFilePickerDialog: selectBaseline,
    clearFile: clearBaseline,
  } = useFilePicker();

  const {
    filePath: target,
    openFilePickerDialog: selectTarget,
    clearFile: clearTarget,
  } = useFilePicker();

  const {
    folder: destinationFolder,
    openFolderPicker: openDestinationFolderPicker,
  } = useFolderPicker();

  const handleRender = () => {
    if (!baseline) {
      alert("Please choose baseline file");
      return;
    }
    if (!target) {
      alert("Please choose target file");
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
    compare(baseline, target, destinationFolder);
  };

  return (
    <PresetMain>
      <h2>Compare Videos</h2>
      <section id="baseline-target-select">
        <h5>Step 1 - Choose video files to compare</h5>
        <FilePicker
          id="baseline-select"
          filePath={baseline}
          selectFile={selectBaseline}
          clearFile={clearBaseline}
          label="Select Baseline"
          placeholder="Select Baseline"
        />
        <FilePicker
          id="target-select"
          filePath={target}
          selectFile={selectTarget}
          clearFile={clearTarget}
          label="Select Target"
          placeholder="Select Target"
        />
      </section>
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
        </div>
      </section>
      <section id="convert">
        <h5>Step 3 - Start conversion</h5>
        <Button id="render" onClick={handleRender}>
          Compare video files
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
    </PresetMain>
  );
}
