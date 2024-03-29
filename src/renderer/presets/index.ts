import { CompareVideos } from "./CompareVideos/CompareVideos";
import { GifMaker } from "./GifMaker/GifMaker";
import { Raw } from "./Raw/Raw";

type Preset = {
  name: string;
  component: () => JSX.Element;
  description: string;
};
type Presets = readonly Preset[];

// Register presets here. Order is appearance order
export const presets: Presets = Object.freeze([
  {
    component: GifMaker,
    name: "Gif Maker",
    description: "Batch convert video files to gifs",
  },
  {
    component: CompareVideos,
    name: "Compare Videos",
    description: "Compare two video files and see differences visually",
  },
  {
    component: Raw,
    name: "Raw",
    description: "Write custom FFmpeg command and let Alpha Badger run it",
  },
]);

export const presetOptions = Object.freeze(
  presets.map((preset, index) => {
    return {
      value: index,
      label: preset.name,
    };
  }),
);
