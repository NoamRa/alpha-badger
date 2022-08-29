import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import styled from "@emotion/styled";
import React from "react";
import type { UseFilePicker } from "../hooks";

type FilePickerProps = {
  id: string;
  filePath: UseFilePicker["filePath"];
  selectFile: UseFilePicker["openFilePickerDialog"];
  clearFile: UseFilePicker["clearFile"];
  label: string;
  placeholder: string;
  width?: string;
  disabled?: boolean;
};

export function FilePicker({
  id,
  filePath,
  selectFile,
  clearFile,
  label,
  placeholder = "Select File",
  width = "300px",
  disabled = false,
}: FilePickerProps) {
  const handleClick = () => {
    filePath && selectFile();
  };

  return (
    <StyledFormGroup
      label={label}
      labelFor={id}
      disabled={disabled}
      width={width}
    >
      <InputGroup
        id={id}
        value={filePath}
        placeholder={placeholder}
        onClick={handleClick}
        asyncControl
        rightElement={
          <>
            <Button
              icon="document-open"
              title="Select Video File"
              onClick={selectFile}
            />
            <Button icon="trash" title="Clear File" onClick={clearFile} />
          </>
        }
      />
    </StyledFormGroup>
  );
}

const StyledFormGroup = styled(FormGroup)`
  width: ${({ width }: { width: string }) => width};
`;
