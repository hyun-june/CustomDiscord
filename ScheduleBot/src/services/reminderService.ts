import { ChannelType, type Client, type TextChannel } from "discord.js";
import { formatKoreanDateTime } from "../utils/date.js";
import { logger } from "../utils/logger.js";
import {
  listDueReminderSchedules,
  listDueStartSchedules,
  markScheduleReminderNotified,
  markScheduleStartNotified,
  type Schedule
} from "./scheduleService.js";

const reminderIntervalMs = 30 * 1000;

function canSendMessage(channel: Awaited<ReturnType<Client["channels"]["fetch"]>>): channel is TextChannel {
  return Boolean(channel && channel.type === ChannelType.GuildText);
}

async function sendScheduleMessage(client: Client, schedule: Schedule, content: string) {
  const channel = await client.channels.fetch(schedule.channelId);

  if (!canSendMessage(channel)) {
    logger.warn(`Cannot send schedule notification to channel: ${schedule.channelId}`);
    return false;
  }

  await channel.send({ content });
  return true;
}

function buildReminderMessage(schedule: Schedule) {
  return [
    `일정 사전 알림: **${schedule.title}**`,
    `${schedule.reminderMinutes}분 후 일정이 시작돼요.`,
    `시간: ${formatKoreanDateTime(schedule.startsAt)}`,
    schedule.description ? `내용: ${schedule.description}` : null,
    `등록자: <@${schedule.createdBy}>`
  ]
    .filter(Boolean)
    .join("\n");
}

function buildStartMessage(schedule: Schedule) {
  return [
    `일정 시작: **${schedule.title}**`,
    "지금 일정이 시작됐어요.",
    `시간: ${formatKoreanDateTime(schedule.startsAt)}`,
    schedule.description ? `내용: ${schedule.description}` : null,
    `등록자: <@${schedule.createdBy}>`
  ]
    .filter(Boolean)
    .join("\n");
}

export function startReminderService(client: Client) {
  const checkReminders = async () => {
    const reminderSchedules = listDueReminderSchedules();

    for (const schedule of reminderSchedules) {
      try {
        await sendScheduleMessage(client, schedule, buildReminderMessage(schedule));
        markScheduleReminderNotified(schedule.id);
      } catch (error) {
        logger.error(`Failed to send reminder for schedule ${schedule.id}`, error);
      }
    }

    const startSchedules = listDueStartSchedules();

    for (const schedule of startSchedules) {
      try {
        await sendScheduleMessage(client, schedule, buildStartMessage(schedule));
        markScheduleStartNotified(schedule.id);
      } catch (error) {
        logger.error(`Failed to send start notification for schedule ${schedule.id}`, error);
      }
    }
  };

  void checkReminders();
  setInterval(() => void checkReminders(), reminderIntervalMs);
}
