import { ChannelType, SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/command.js";
import {
  createSchedule,
  deleteSchedule,
  listSchedulesBetween,
  listUpcomingSchedules,
  type Schedule
} from "../services/scheduleService.js";
import { formatKoreanDateTime, getTodayRangeInKorea, parseKoreanDateTime } from "../utils/date.js";

function formatScheduleList(schedules: Schedule[]) {
  if (schedules.length === 0) {
    return "등록된 일정이 없습니다.";
  }

  return schedules
    .map((schedule) => {
      const description = schedule.description ? `\n   ${schedule.description}` : "";
      return `#${schedule.id} ${schedule.title}\n   ${formatKoreanDateTime(schedule.startsAt)} / <#${schedule.channelId}>${description}`;
    })
    .join("\n\n");
}

export const scheduleCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("일정을 등록하고 관리합니다.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("새 일정을 등록합니다.")
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("일정 제목")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("date")
            .setDescription("날짜: 2026-05-03")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("time")
            .setDescription("시간: 21:00")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("reminder_minutes")
            .setDescription("몇 분 전에 알림을 보낼지")
            .setMinValue(0)
            .setMaxValue(10080)
            .setRequired(false)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("알림을 보낼 채널")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("일정 설명")
            .setMaxLength(500)
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("다가오는 일정을 확인합니다.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("today")
        .setDescription("오늘 일정을 확인합니다.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("일정을 삭제합니다.")
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription("삭제할 일정 ID")
            .setMinValue(1)
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    if (!interaction.guildId) {
      await interaction.reply({ content: "서버 안에서만 사용할 수 있는 명령어입니다.", ephemeral: true });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "add") {
      const title = interaction.options.getString("title", true);
      const date = interaction.options.getString("date", true);
      const time = interaction.options.getString("time", true);
      const startsAt = parseKoreanDateTime(date, time);

      if (!startsAt) {
        await interaction.reply({
          content: "날짜와 시간은 `date:2026-05-03`, `time:21:00` 형식으로 입력해 주세요.",
          ephemeral: true
        });
        return;
      }

      if (startsAt.getTime() <= Date.now()) {
        await interaction.reply({ content: "지난 시간으로는 일정을 등록할 수 없습니다.", ephemeral: true });
        return;
      }

      const channel = interaction.options.getChannel("channel") ?? interaction.channel;
      const description = interaction.options.getString("description");
      const reminderMinutes = interaction.options.getInteger("reminder_minutes") ?? 30;

      if (!channel || channel.type !== ChannelType.GuildText) {
        await interaction.reply({ content: "알림 채널은 텍스트 채널이어야 합니다.", ephemeral: true });
        return;
      }

      const id = createSchedule({
        guildId: interaction.guildId,
        channelId: channel.id,
        createdBy: interaction.user.id,
        title,
        description,
        startsAt,
        reminderMinutes
      });

      await interaction.reply({
        content: [
          `일정이 등록됐어요. (#${id})`,
          `제목: **${title}**`,
          `시간: ${formatKoreanDateTime(startsAt)}`,
          `알림: ${reminderMinutes === 0 ? "시작 시간" : `${reminderMinutes}분 전`}`,
          `채널: <#${channel.id}>`
        ].join("\n"),
        ephemeral: true
      });
      return;
    }

    if (subcommand === "list") {
      const schedules = listUpcomingSchedules(interaction.guildId);

      await interaction.reply({
        content: formatScheduleList(schedules),
        ephemeral: true
      });
      return;
    }

    if (subcommand === "today") {
      const { start, end } = getTodayRangeInKorea();
      const schedules = listSchedulesBetween(interaction.guildId, start, end);

      await interaction.reply({
        content: formatScheduleList(schedules),
        ephemeral: true
      });
      return;
    }

    if (subcommand === "remove") {
      const id = interaction.options.getInteger("id", true);
      const deleted = deleteSchedule(interaction.guildId, id);

      await interaction.reply({
        content: deleted ? `#${id} 일정을 삭제했어요.` : `#${id} 일정을 찾지 못했어요.`,
        ephemeral: true
      });
    }
  }
};
