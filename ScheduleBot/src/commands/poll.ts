import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/command.js";

const numberEmojis = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟",
];
const maxOptions = numberEmojis.length;

const pollBuilder = new SlashCommandBuilder()
  .setName("poll")
  .setDescription("선택지 개수를 지정해서 투표를 생성합니다.")
  .addStringOption((option) =>
    option.setName("question").setDescription("투표 질문").setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName("count")
      .setDescription("투표 선택지 개수")
      .setMinValue(2)
      .setMaxValue(maxOptions)
      .setRequired(true),
  );

for (let index = 1; index <= maxOptions; index += 1) {
  pollBuilder.addStringOption((option) =>
    option
      .setName(`option_${index}`)
      .setDescription(`${index}번 선택지`)
      .setRequired(index <= 2),
  );
}

export const pollCommand: SlashCommand = {
  data: pollBuilder,
  async execute(interaction) {
    const question = interaction.options.getString("question", true);
    const count = interaction.options.getInteger("count", true);
    const options = Array.from({ length: count }, (_, index) =>
      interaction.options.getString(`option_${index + 1}`),
    );

    const missingOptionIndex = options.findIndex((option) => !option);

    if (missingOptionIndex !== -1) {
      await interaction.reply({
        content: `선택지 개수를 ${count}개로 지정했으면 option_${missingOptionIndex + 1}까지 모두 입력해야 합니다.`,
        ephemeral: true,
      });
      return;
    }

    const pollLines = options.map(
      (option, index) => `${numberEmojis[index]} ${option}`,
    );
    const message = await interaction.reply({
      content: [`**${question}**`, ...pollLines].join("\n"),
      fetchReply: true,
    });

    for (let index = 0; index < count; index += 1) {
      await message.react(numberEmojis[index]);
    }
  },
};
