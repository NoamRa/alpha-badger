import FfmpegCommand from "fluent-ffmpeg";

// TODO get from user or app config
const ffmpegPath = "C:\\util\\ffmpeg-3.4-win64-static\\bin\\ffmpeg.exe";
const ffprobePath = "C:\\util\\ffmpeg-3.4-win64-static\\bin\\ffprobe.exe";

export const command = FfmpegCommand();
command.setFfmpegPath(ffmpegPath);
command.setFfprobePath(ffprobePath);
