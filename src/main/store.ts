import Store from "electron-store";

type Schema = {
  readonly ffmpegPath: string;
  readonly ffprobePath: string;
  readonly selectedPresetIndex: number;
};

const schema = {
  ffmpegPath: {
    type: "string",
  },
  ffprobePath: {
    type: "string",
  },
  selectedPresetIndex: {
    type: "number",
  },
} as const;

const _store = new Store<Schema>({
  schema,
});

// TODO auto generate
export const store = {
  getFFmpegPath: (): string => {
    return _store.get("ffmpegPath", "");
  },
  setFFmpegPath: (ffmpegPath: string): void => {
    _store.set("ffmpegPath", ffmpegPath);
  },
  getFFprobePath: (): string => {
    return _store.get("ffprobePath", "");
  },
  setFFprobePath: (ffprobePath: string): void => {
    _store.set("ffprobePath", ffprobePath);
  },
  getSelectedPresetIndex: (): number => {
    return _store.get("selectedPresetIndex", 0);
  },
  setSelectedPresetIndex: (selectedPresetIndex: number): void => {
    _store.set("selectedPresetIndex", selectedPresetIndex);
  },
};

export function describeStoreContent(): void {
  console.log("store content:");
  for (const [key, value] of _store) {
    console.log(`'${key}': '${JSON.stringify(value, null, 2)}'`);
  }
}
