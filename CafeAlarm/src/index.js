import { sendDiscordWebhook } from "./discordWebhook.js";
import { getCafeData } from "./naverCafe.js";
import fs from "fs/promises";

const main = async () => {
  await fs.writeFile("./data/cafeData.json", JSON.stringify(articles), "utf-8");
};

getCafeData();
sendDiscordWebhook();
