import Store from "electron-store";
type Schema = {
  readonly ffmpegPath?: string;
  readonly ffprobePath?: string;
};

const schema = {
  ffmpegPath: {
    type: "string",
  },
  ffprobePath: {
    type: "string",
  },
} as const;

export const store = new Store<Schema>({
  schema,
});

export function describeStoreContent(store: Store<Schema>): void {
  console.log("store content:");
  for (const [key, value] of store) {
    console.log(`'${key}': '${JSON.stringify(value, null, 2)}'`);
  }
}
