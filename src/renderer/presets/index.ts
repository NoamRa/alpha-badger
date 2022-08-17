import { ExtractAlpha } from "./ExtractAlpha/ExtractAlpha";
import { GifMaker } from "./GifMaker/GifMaker";

type Preset = {
  name: string;
  component: () => JSX.Element;
};
type Presets = readonly Preset[];

// Register presets here. Order is appearance order
export const presets: Presets = Object.freeze([
  { component: GifMaker, name: "Gif Maker" },
  { component: ExtractAlpha, name: "Extract Alpha" },
]);

export const presetOptions = Object.freeze(
  presets.map((preset, index) => {
    return {
      value: index,
      label: preset.name,
    };
  }),
);
