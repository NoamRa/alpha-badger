import type { FileMeta, FilesMetadata } from "./useMetadata";

function buildCommand(
  input: string,
  width: number,
  fps: number,
  outputDir: string,
): string {
  const destPath = alphaBadgerApi.path.join(
    outputDir,
    alphaBadgerApi.path.basename(input),
  );
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

export function processFile(fileMeta: FileMeta, destinationFolder: string) {
  const { filePath, desiredWidth, desiredFps } = fileMeta;
  const command = buildCommand(
    filePath,
    desiredWidth,
    desiredFps,
    destinationFolder,
  );
  console.log("renderer calling runFFmpegCommand\n", command);
  alphaBadgerApi.runFFmpegCommand(command);
}

export function renderFiles(
  filesMeta: FilesMetadata,
  destinationFolder: string,
) {
  const files = [Object.values(filesMeta)[0]]; // for now just one file
  for (const file of files) {
    processFile(file, destinationFolder);
  }
}
