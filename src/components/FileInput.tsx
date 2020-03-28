import React, { ChangeEvent } from "react";

type FileInputProps = {
  onChange: (files: File[]) => void;
};

function FileInput({ onChange }: FileInputProps) {
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt?.target?.files) {
      onChange([...evt.target.files]);
    }
  };

  return (
    <div>
      <label htmlFor="fileInput">Files</label>
      <input
        id="fileInput"
        name="fileInput"
        type="file"
        accept="video/*"
        onChange={handleChange}
        multiple
      />
    </div>
  );
}

export default FileInput;
