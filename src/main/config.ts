type Schema = { readonly ffmpegPath: unknown };

const schema = {
  ffmpegPath: {
    type: "string",
  },
} as const;

export const store: Store<Schema> = new Store({
  schema,
});

export function describeStoreContent(store: Store<Schema>): void {
  console.log("store content:");
  for (const [key, value] of store) {
    console.log(`'${key}': '${JSON.stringify(value, null, 2)}'`);
  }
}
