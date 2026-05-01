import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/command.js";

export const pingCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("봇의 응답 상태를 확인합니다."),
  async execute(interaction) {
    await interaction.reply("Pong!");
  }
};
