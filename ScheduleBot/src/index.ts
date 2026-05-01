import { Client, GatewayIntentBits } from "discord.js";
import { env } from "./config/env.js";
import { runMigrations } from "./db/migrations.js";
import { handleInteractionCreate } from "./events/interactionCreate.js";
import { handleReady } from "./events/ready.js";
import { startReminderService } from "./services/reminderService.js";
import { logger } from "./utils/logger.js";

runMigrations();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", (readyClient) => {
  handleReady(readyClient);
  startReminderService(readyClient);
});
client.on("interactionCreate", handleInteractionCreate);

client.login(env.discordToken).catch((error) => {
  logger.error("Failed to login to Discord.", error);
  process.exit(1);
});
