/** See exposed methods on preload.ts */
/* eslint-disable @typescript-eslint/ban-ts-comment */
const {
  runFFmpegCommand,
  readMetadata,
  listen,
  chooseFiles,
  chooseFolder,
  path,
  stopAll,
  // @ts-ignore // TODO find a way to import type 'AlphaBadgerApi'.
  // At the moment it fails on runtime even though 'import type' should disappear after compile
} = window.alphaBadgerApi;
/* eslint-enable */

// TODO find way to import type FFprobeJSON
// At the moment it fails on runtime even though 'import type' should disappear after compile
type FFprobeJSON = {
  streams: Array<{
    codec_type: string;
    width: number;
    r_frame_rate: string;
  }>;
};

// region files to render
const filePickerButton: HTMLElement = document.getElementById("filePicker")!;
const clearFilesButton: HTMLElement = document.getElementById("clearFiles")!;
const files: HTMLElement = document.getElementById("files")!;
type FileMeta = {
  filePath: string;
  r_frame_rate: string;
  fps: number;
  width: number;
  desiredFps: number;
  desiredWidth: number;
};

function createNumericInput(
  id: string,
  name: string,
  max: number,
  onChange: (num: number) => void,
): HTMLDivElement {
  const container = document.createElement("div");

  const label = document.createElement("label");
  label.id = `${id}-label`;
  label.htmlFor = name;
  label.innerText = `${name}: `;
  container.appendChild(label);

  const input = document.createElement("input");
  label.id = `${id}-input`;
  input.type = "number";
  input.name = name;
  input.value = max.toString();
  input.max = max.toString();
  input.min = (0).toString();
  input.onchange = (evt: Event) => {
    const { valueAsNumber } = evt.target as HTMLInputElement;
    onChange(valueAsNumber);
  };
  container.appendChild(input);

  return container;
}

const filesManager = new Map<string, FileMeta>();
filePickerButton.addEventListener("click", async () => {
  const filePaths: string[] = await chooseFiles();
  if (filePaths.length === 0) {
    console.log("user canceled");
    return;
  }

  for (const filePath of filePaths) {
    const metadata: FFprobeJSON = JSON.parse(await readMetadata(filePath));
    const videoStream = metadata?.streams?.find(
      (stream) => stream?.codec_type === "video",
    );
    if (!videoStream) {
      continue;
    }
    const { width, r_frame_rate } = videoStream;
    const [numerator, denominator] = r_frame_rate.split("/").map((n) => +n);
    const fps = Math.round(numerator / denominator);

    filesManager.set(filePath, {
      filePath,
      width,
      r_frame_rate,
      fps,
      desiredWidth: width,
      desiredFps: fps,
    });

    const filePathEl = document.createElement("li");
    filePathEl.append(
      filePath,
      createNumericInput(filePath, "Width", width, (updatedWidth) => {
        filesManager.set(filePath, {
          ...filesManager.get(filePath)!,
          desiredWidth: updatedWidth,
        });
      }),
      createNumericInput(filePath, "Frames per second", fps, (updatedFps) => {
        filesManager.set(filePath, {
          ...filesManager.get(filePath)!,
          desiredFps: updatedFps,
        });
      }),
    );
    files.append(filePathEl);
  }
});

clearFilesButton.addEventListener("click", async () => {
  filesManager.clear();
  files.innerHTML = "";
});
// endregion

// region destination folder
const folderPicker: HTMLElement = document.getElementById("folderPicker")!;
const destinationFolderView: HTMLElement =
  document.getElementById("destinationFolder")!;
let destinationFolder = "";
folderPicker.addEventListener("click", async () => {
  const folder: string | undefined = await chooseFolder();
  if (folder) {
    destinationFolder = folder;
    destinationFolderView.innerText = folder;
  }
});
// endregion

// region render
function buildCommand(
  input: string,
  width: number,
  fps: number,
  outputDir: string,
): string {
  const destPath = path.join(outputDir, path.basename(input));
  // Kudos to Collin Burger from GIPHY Engineering
  // https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/
  return "".concat(
    `-i "${input}" `,
    `-filter_complex `.concat(
      `"`,
      `[0:v] fps=${fps},scale=width=${width}:height=-1,split [paletteinput][vid];`,
      `[paletteinput] palettegen [palette];`,
      `[vid][palette] paletteuse`,
      `" `,
    ),
    `-y "${destPath}.gif"`,
  );
}
const renderButton: HTMLElement = document.getElementById("render")!;
renderButton.addEventListener("click", () => {
  const { filePath, desiredWidth, desiredFps } = [...filesManager.values()][0];
  const command = buildCommand(
    filePath,
    desiredWidth,
    desiredFps,
    destinationFolder,
  );
  console.log("renderer calling runFFmpegCommand\n", command);
  runFFmpegCommand(command);
});
// region events from rendering process

// region status
const statusEl: HTMLElement = document.getElementById("status")!;
listen("ffmpeg-error", (error: unknown) => {
  console.log("got error", error);
  statusEl.innerText = `Error \n${error}`;
});

listen("ffmpeg-start", (command: string) => {
  console.log("got start", command);
  statusEl.innerText = `Working...`;
});

listen("ffmpeg-end", () => {
  console.log("got end");
  statusEl.innerText = `Done`;
});

// region progress
const progressEl: HTMLElement = document.getElementById("progress")!;
listen("ffmpeg-progress", (progressStr: string) => {
  console.log("got progress", progressStr);
  if (progressStr) {
    const progress = JSON.parse(progressStr);
    const progressFrag = new DocumentFragment();
    Object.entries(progress).forEach(([key, value]) => {
      const progressInfo = document.createElement("li");
      progressInfo.innerText = `${key}: ${value}`;
      progressFrag.appendChild(progressInfo);
    });
    progressEl.innerText = "";
    progressEl.appendChild(progressFrag);
  }
});
// endregion

// region stop
const stopButton: HTMLElement = document.getElementById("stop")!;
stopButton.addEventListener("click", () => {
  console.log("sending stop signal");
  stopAll();
});

listen("ffmpeg-codecData", (codecData: unknown) => {
  console.log("got codecData", codecData);
});
// endregion
