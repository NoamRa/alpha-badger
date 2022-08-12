import React from "react";

import { Button, Collapse, FormGroup, NumericInput } from "@blueprintjs/core";
import type { FileMeta, UseMetadata } from "../hooks/useMetadata";
import { useToggle } from "../../../hooks/useToggle";
import styled from "@emotion/styled";

const FileViewWrapper = styled.li`
  margin: 1em;
`;

type FileViewProps = {
  file: FileMeta;
  updateField: UseMetadata["updateField"];
};

export function FileView({ file, updateField }: FileViewProps) {
  const [isOpen, toggleIsOpen] = useToggle(false);

  return (
    <FileViewWrapper>
      <strong>{file.filePath}</strong>
      <br />
      <Button onClick={toggleIsOpen.flip}>
        {isOpen ? "Hide" : "Show"} Details
      </Button>
      <Collapse isOpen={isOpen}>
        <FormGroup
          helperText={`The width of the output video (Max ${file.width})`}
          label="Desired width:"
          labelFor={`${file.filePath}-desiredWidth`}
        >
          <NumericInput
            id={`${file.filePath}-desiredWidth`}
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
        </FormGroup>
        <FormGroup
          helperText={`Desired frame rate (Max ${file.fps})`}
          label="Desired frame rate:"
          labelFor={`${file.filePath}-desiredFps`}
        >
          <NumericInput
            id={`${file.filePath}-desiredFps`}
            name={"Frames per second"}
            value={file.desiredFps}
            max={file.fps}
            placeholder="Enter desired FPS..."
            onValueChange={(desiredFps) => {
              updateField(file.filePath, "desiredFps", Math.round(desiredFps));
            }}
          />
        </FormGroup>
      </Collapse>
    </FileViewWrapper>
  );
}
