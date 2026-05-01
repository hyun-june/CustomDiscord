import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/command.js";

export const helpCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("사용 가능한 명령어를 확인합니다."),
  async execute(interaction) {
    await interaction.reply({
      content: [
        "사용 가능한 명령어",
        "`/ping` - 봇 응답 확인",
        "`/help` - 명령어 목록 확인",
        "`/poll` - 선택지 개수를 지정해서 투표 생성",
        "`/schedule add` - 일정 등록",
        "`/schedule list` - 다가오는 일정 확인",
        "`/schedule today` - 오늘 일정 확인",
        "`/schedule remove` - 일정 삭제"
      ].join("\n"),
      ephemeral: true
    });
  }
};
