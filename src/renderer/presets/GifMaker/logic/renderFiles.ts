import type { FileMeta, FilesMetadata } from "../hooks/useMetadata";

function buildCommand(
  input: string,
  width: number,
  fps: number,
  outputDir: string,
): string {
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
    `-y "${calcDestPath(outputDir, input)}"`,
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
  const files = Object.values(filesMeta);
  for (const file of files) {
    processFile(file, destinationFolder);
  }
}

export function calcDestPath(outputDir: string, input: string): string {
  const name = alphaBadgerApi.path.parse(input).name + ".gif";
  return alphaBadgerApi.path.join(outputDir, name);
}
