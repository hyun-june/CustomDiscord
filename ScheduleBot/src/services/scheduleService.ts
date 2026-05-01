import { db } from "../db/client.js";

export type Schedule = {
  id: number;
  guildId: string;
  channelId: string;
  createdBy: string;
  title: string;
  description: string | null;
  startsAt: string;
  reminderMinutes: number;
  reminderNotifiedAt: string | null;
  startNotifiedAt: string | null;
  createdAt: string;
};

type ScheduleRow = {
  id: number;
  guild_id: string;
  channel_id: string;
  created_by: string;
  title: string;
  description: string | null;
  starts_at: string;
  reminder_minutes: number;
  reminder_notified_at: string | null;
  start_notified_at: string | null;
  created_at: string;
};

export type CreateScheduleInput = {
  guildId: string;
  channelId: string;
  createdBy: string;
  title: string;
  description?: string | null;
  startsAt: Date;
  reminderMinutes: number;
};

function toSchedule(row: ScheduleRow): Schedule {
  return {
    id: row.id,
    guildId: row.guild_id,
    channelId: row.channel_id,
    createdBy: row.created_by,
    title: row.title,
    description: row.description,
    startsAt: row.starts_at,
    reminderMinutes: row.reminder_minutes,
    reminderNotifiedAt: row.reminder_notified_at,
    startNotifiedAt: row.start_notified_at,
    createdAt: row.created_at
  };
}

export function createSchedule(input: CreateScheduleInput) {
  const result = db
    .prepare(`
      INSERT INTO schedules (
        guild_id,
        channel_id,
        created_by,
        title,
        description,
        starts_at,
        reminder_minutes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      input.guildId,
      input.channelId,
      input.createdBy,
      input.title,
      input.description ?? null,
      input.startsAt.toISOString(),
      input.reminderMinutes
    );

  return Number(result.lastInsertRowid);
}

export function listUpcomingSchedules(guildId: string, limit = 10) {
  return db
    .prepare(`
      SELECT *
      FROM schedules
      WHERE guild_id = ?
        AND starts_at >= ?
      ORDER BY starts_at ASC
      LIMIT ?
    `)
    .all(guildId, new Date().toISOString(), limit)
    .map((row) => toSchedule(row as ScheduleRow));
}

export function listSchedulesBetween(guildId: string, start: Date, end: Date, limit = 20) {
  return db
    .prepare(`
      SELECT *
      FROM schedules
      WHERE guild_id = ?
        AND starts_at >= ?
        AND starts_at < ?
      ORDER BY starts_at ASC
      LIMIT ?
    `)
    .all(guildId, start.toISOString(), end.toISOString(), limit)
    .map((row) => toSchedule(row as ScheduleRow));
}

export function deleteSchedule(guildId: string, id: number) {
  const result = db.prepare("DELETE FROM schedules WHERE guild_id = ? AND id = ?").run(guildId, id);

  return result.changes > 0;
}

export function listDueReminderSchedules(now = new Date()) {
  return db
    .prepare(`
      SELECT *
      FROM schedules
      WHERE reminder_minutes > 0
        AND reminder_notified_at IS NULL
        AND datetime(starts_at, '-' || reminder_minutes || ' minutes') <= datetime(?)
        AND datetime(starts_at) >= datetime(?, '-1 day')
      ORDER BY starts_at ASC
      LIMIT 20
    `)
    .all(now.toISOString(), now.toISOString())
    .map((row) => toSchedule(row as ScheduleRow));
}

export function listDueStartSchedules(now = new Date()) {
  return db
    .prepare(`
      SELECT *
      FROM schedules
      WHERE start_notified_at IS NULL
        AND datetime(starts_at) <= datetime(?)
        AND datetime(starts_at) >= datetime(?, '-1 day')
      ORDER BY starts_at ASC
      LIMIT 20
    `)
    .all(now.toISOString(), now.toISOString())
    .map((row) => toSchedule(row as ScheduleRow));
}

export function markScheduleReminderNotified(id: number) {
  db.prepare("UPDATE schedules SET reminder_notified_at = ? WHERE id = ?").run(new Date().toISOString(), id);
}

export function markScheduleStartNotified(id: number) {
  db.prepare("UPDATE schedules SET start_notified_at = ? WHERE id = ?").run(new Date().toISOString(), id);
}
