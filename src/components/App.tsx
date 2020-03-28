import React, { useState, FormEvent } from "react";
import FileInput from "./FileInput";
import AlphaCheckbox from "./AlphaCheckbox";
import useFFmpeg from "../logic/useFFmpeg";
import { calcNewPath } from "../logic/encoding";
import Title from "./Title";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [doAlpha, setDoAlpha] = useState<boolean>(false);
  const { progress, currentFile, processVideos } = useFFmpeg();

  const preview = () => {
    if (files.length === 0) return "";
    return (
      <ul>
        {files.map(({ path: filePath }) => (
          <>
            <li>{calcNewPath(filePath)}</li>
            {doAlpha && <li>{calcNewPath(filePath, true)}</li>}
          </>
        ))}
      </ul>
    );
  };

  const handleProcessVideos = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    processVideos(files, doAlpha);
  };

  const handlePreview = () => {};
  return (
    <div style={{ backgroundColor: "lightgray" }}>
      <Title />
      <form onInput={handlePreview} onSubmit={handleProcessVideos}>
        <FileInput onChange={setFiles} />
        <AlphaCheckbox checked={doAlpha} onChange={setDoAlpha} />
        <div>
          <output name="preview" htmlFor="fileInput alpha">
            {preview()}
          </output>
        </div>
        <input type="submit" value="Render" />
      </form>
      {currentFile && (
        <div>
          Working on: {currentFile} - {progress}%
        </div>
      )}
    </div>
  );
}

export default App;
