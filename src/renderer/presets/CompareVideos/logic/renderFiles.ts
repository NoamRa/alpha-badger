export async function compare(
  baselinePath: string,
  targetPath: string,
  outputDir: string,
): Promise<void> {
  const baselineMetadata = extractMetadata(
    await alphaBadgerApi.readMetadata(baselinePath),
  );
  const targetMetadata = extractMetadata(
    await alphaBadgerApi.readMetadata(targetPath),
  );

  const command = buildCommand({
    baselinePath,
    targetPath,
    outputDir,
    outputWidth: Math.max(baselineMetadata.width, targetMetadata.width),
    outputHeight: Math.max(baselineMetadata.height, targetMetadata.height),
    outputFrameRate:
      baselineMetadata.frameRateValue > targetMetadata.frameRateValue
        ? baselineMetadata.frameRate
        : targetMetadata.frameRate,
  });
  console.log("renderer calling runFFmpegCommand\n", command);
  alphaBadgerApi.runFFmpegCommand(command);
}

/**
 * Visually compare two video files, baseline and target by
 * creating a video split to four quadrants:
 * 🡼 upper left - baseline,   🡽 upper right - target,
 * 🡿 lower left - diff,       🡾 lower right - timecode and frame number
 * Audio is dropped from result
 * positioning based on https://trac.ffmpeg.org/wiki/Create%20a%20mosaic%20out%20of%20several%20input%20videos
 */

type BuildCommandParams = {
  baselinePath: string;
  targetPath: string;
  outputDir: string;
  outputWidth: number;
  outputHeight: number;
  outputFrameRate: string;
};
function buildCommand({
  baselinePath,
  targetPath,
  outputDir,
  outputWidth,
  outputHeight,
  outputFrameRate,
}: BuildCommandParams): string {
  const explanation = [
    "Baseline on the upper left",
    "Target on the upper right",
    "Difference on the lower left",
    "Gray in diff means same pixels",
  ];

  const filterComplex = `"${[
    // prepare diff fom baseline and overlay
    // stream is split so they could be consumed both by blend and in end result
    `[0:v] setsar=sar=1, setpts=PTS-STARTPTS, pad=${outputWidth}:${outputHeight}:-1:-1:color=gray, split [baseline][upperLeft]`,
    `[1:v] setsar=sar=1, setpts=PTS-STARTPTS, pad=${outputWidth}:${outputHeight}:-1:-1:color=gray, split [target][upperRight]`,
    `[baseline][target] blend=all_mode=difference128 [lowerLeft]`,

    // creating the fourth input
    `${[
      // part 1 - black background
      `color=c=black:${outputWidth}x${outputHeight}`,
      // part 2 - frame counter
      `drawtext=${[
        `fontfile='Hack-Regular.ttf'`,
        `text=frame #%{frame_num}`,
        `timecode_rate=${outputFrameRate}`,
        `x=(main_w - text_w) / 2`,
        `y=(main_h / 8)`,
        `fontcolor=white`,
        `fontsize=${Math.round(outputWidth / 10)}`, // TODO
      ].join(":")}`,
      // part 3 - timecode
      `drawtext=${[
        `fontfile='Hack-Regular.ttf'`,
        `timecode='00\\:00\\:00\\:00'`,
        `timecode_rate=${outputFrameRate}`,
        `x=(main_w - text_w) / 2`,
        `y=(main_h / 4) + line_h`,
        `fontcolor=white`,
        `fontsize=${Math.round(outputWidth / 10)}`, // TODO
      ].join(":")}`,
      // part 4 - explanation
      explanation.map(
        (line, index) =>
          `drawtext=${[
            `fontfile='Hack-Regular.ttf'`,
            `text=${line}`,
            `x=(main_w - text_w) / 2`,
            `y=(main_h / 2) + (main_h / ${explanation.length * 4} * ${index})`,
            `fontcolor=white`,
            `fontsize=${Math.round(outputWidth / 20)}`, // TODO
          ].join(":")}`,
      ),
    ].join(", ")} [lowerRight]`,

    // create canvas
    `nullsrc=size=${outputWidth * 2}x${outputHeight * 2}[canvas]`,
    // overlay quadrants
    `[canvas][upperLeft] overlay=shortest=1 [withUpperLeft]`,
    `[withUpperLeft][upperRight] overlay=shortest=1:x=${outputWidth}:y=0 [withUpperRight]`,
    `[withUpperRight][lowerLeft] overlay=shortest=1:x=0:y=${outputHeight} [withLowerLeft]`,
    `[withLowerLeft][lowerRight] overlay=shortest=1:x=${outputWidth}:y=${outputHeight}`,
  ].join("; ")}"`;

  const command = [
    `-i ${baselinePath}`,
    `-i ${targetPath}`,
    `-filter_complex ${filterComplex}`,
    "-c:v libx264",
    "-preset slow",
    `-r ${outputFrameRate}`,
    "-crf 6", // quality
    "-an", // remove audio
    `-y ${alphaBadgerApi.path.join(outputDir, "videoDiff.mp4")}`,
  ].join(" ");

  return command;
}

function extractMetadata(metadata: FFprobeJSON): {
  width: number;
  height: number;
  frameRate: string;
  frameRateValue: number;
} {
  const videoStream = metadata?.streams?.find(
    (stream) => stream?.codec_type === "video",
  );
  if (!videoStream) {
    throw new Error(`Failed to find video stream`);
  }
  const { width, height, r_frame_rate } = videoStream;
  const [numerator, denominator] = r_frame_rate.split("/").map((n) => +n);
  const frameRateValue = numerator / denominator;

  return {
    width,
    height,
    frameRate: r_frame_rate,
    frameRateValue,
  };
}
