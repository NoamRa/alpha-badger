import React from "react";
import { Button, TextArea } from "@blueprintjs/core";
import {
  FFmpegStatus,
  useCodecData,
  useData,
  useFFmpegStatus,
  useProgress,
  useSessionStorageItem,
} from "../../hooks";
import { Status } from "../../components/Status";
import { PresetMain } from "../../components/PresetMain";

export function Raw() {
  const [command, setCommand] = useSessionStorageItem<string>(
    "raw-command",
    "",
  );

  const cleanedCommand = cleanCommand(command);

  const { status } = useFFmpegStatus();
  useProgress(); // subscribe to progress events
  useCodecData(); // subscribe to codec data events
  useData(); // subscribe to data events

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommand(evt.target.value);
  };

  const handleRender = () => {
    if (status === FFmpegStatus.Working) {
      alert(
        "There's conversion in progress. Please wait for it to finish or stop the process",
      );
      return;
    }
    alphaBadgerApi.runFFmpegCommand(cleanedCommand);
  };

  return (
    <PresetMain>
      <h2>Raw</h2>
      <section id="convert">
        <h5>Write FFmpeg command and run it</h5>
        <Button id="render" onClick={handleRender}>
          Run FFmpeg command
        </Button>
        {status === FFmpegStatus.Working && (
          <Button id="stop" onClick={alphaBadgerApi.stopAll}>
            Stop
          </Button>
        )}
        <Status status={status} />
      </section>
      <TextArea
        growVertically={true}
        large={true}
        onChange={handleChange}
        value={command}
        placeholder={
          "Something like:\n-i /path/to/video.mp4 -c /path/to/out.mp4"
        }
        fill
        spellCheck={false}
      />
      <p>
        The end command is:
        <br />
        <b>ffmpeg {cleanedCommand}</b>
      </p>

      <h5>Some pointers</h5>
      <ul>
        <li>Use absolutes paths</li>
        <li>
          FFmpeg exe is prepended to the command so you don't need to write it
        </li>
        <li>New lines are removed</li>
        <li>
          <a
            onClick={() => {
              alphaBadgerApi.openExternal("https://alfg.dev/ffmpeg-commander/");
            }}
          >
            FFmpeg Commander
          </a>
          {" is a great tool to compose commands"}
        </li>
        <li>{"To see logging, go to View > Toggle Developer Tools"}</li>
      </ul>
    </PresetMain>
  );
}

const cleanCommand = (command: string): string => {
  return command.replace(/\s{2,}/g, " ");
};
