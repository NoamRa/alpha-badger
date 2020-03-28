import React from "react";

type DirectoryInputProps = {
  directory: string;
  onChange: (dir: string) => void;
};

function DirectoryInput({ directory, onChange }: DirectoryInputProps) {
  const handleChange = (evt: any) => {
    console.log(evt);
    onChange(evt);
  };
  return (
    <input
      type="file"
      // @ts-ignore 
      webkitdirectory=""
      value={directory}
      onChange={handleChange}
    />
  );
}

export default DirectoryInput;
