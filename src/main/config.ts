import fs from "fs-extra";

type AppConfig = {
  ffmpegPath: string;
};

export async function readConfig(path: string): Promise<AppConfig> {
  try {
    const config: AppConfig = await fs.readJson(path);
    console.log("config: \n", config);
    return config;
  } catch (err) {
    console.error(err);
  }
}
