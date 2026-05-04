import { REST, Routes } from "discord.js";
import { commands } from "./commands/index.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const rest = new REST({ version: "10" }).setToken(env.discordToken);

async function main() {
  const body = commands.map((command) => command.data.toJSON());

  await rest.put(Routes.applicationCommands(env.discordClientId), { body });

  logger.info(`Registered ${body.length} global slash commands.`);
}

main().catch((error) => {
  logger.error("Failed to register slash commands.", error);
  process.exit(1);
});
