import type { Interaction } from "discord.js";
import { commandMap } from "../commands/index.js";
import { logger } from "../utils/logger.js";

export async function handleInteractionCreate(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = commandMap.get(interaction.commandName);

  if (!command) {
    await interaction.reply({ content: "알 수 없는 명령어입니다.", ephemeral: true });
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Failed to execute command: ${interaction.commandName}`, error);

    const response = { content: "명령어 실행 중 오류가 발생했습니다.", ephemeral: true };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(response);
    } else {
      await interaction.reply(response);
    }
  }
}
