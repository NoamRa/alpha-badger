export type ID = number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Process = any; // TODO

export type Progress = Record<string, string | number>;
export type FFmpegError = {
  id: ID;
  message: string;
  command: string;
  stack?: string;
};

export type FFmpegCommandHandlers = {
  handleError: (err: FFmpegError) => void;
  handleStart: (commandLine: string) => void;
  handleEnd: () => void;
  handleProgress: (progress: Progress) => void;
  handleCodecData: (data: unknown) => void;
  handleData: (data: string) => void;
};

//#region region FFprobe print_format json
// expect the unexpected
export type Stream = {
  index: number;
  codec_name: string;
  codec_long_name: string;
  codec_type: string;
  codec_tag_string: string;
  codec_tag: string;
  width: number;
  height: number;
  coded_width: number;
  coded_height: number;
  closed_captions: number;
  has_b_frames: number;
  sample_aspect_ratio: string;
  display_aspect_ratio: string;
  pix_fmt: string;
  level: number;
  refs: number;
  r_frame_rate: string; // "number/number"
  avg_frame_rate: string; // "number/number"
  time_base: string; // "number/number"
  start_pts: number;
  start_time: number;
  duration_ts: number;
  duration: number;
  nb_frames: number;
  disposition?: {
    [property: string]: any;
  };
  tags?: {
    creation_time: string;
    language: string;
    handler_name: string;
    vendor_id?: string;
    encoder?: string;
    [property: string]: any;
  };
  [property: string]: any;
};

export type Format = {
  filename: string; // full path to file
  nb_streams: number;
  nb_programs: number;
  format_name: string;
  format_long_name: string;
  start_time: number;
  duration: number;
  size: number;
  bit_rate: number;
  probe_score: number;
  tags?: {
    major_brand: string;
    minor_version: number;
    compatible_brands: string;
    creation_time: string;
  };
  [property: string]: any;
};

export type FFprobeJSON = {
  streams: Stream[];
  format: Format;
};

//#endregion
