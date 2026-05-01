import { db } from "./client.js";

type TableColumn = {
  name: string;
};

function columnExists(tableName: string, columnName: string) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as TableColumn[];

  return columns.some((column) => column.name === columnName);
}

export function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      created_by TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      starts_at TEXT NOT NULL,
      reminder_minutes INTEGER NOT NULL DEFAULT 0,
      notified_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  if (!columnExists("schedules", "reminder_notified_at")) {
    db.exec("ALTER TABLE schedules ADD COLUMN reminder_notified_at TEXT");
    db.exec("UPDATE schedules SET reminder_notified_at = notified_at WHERE notified_at IS NOT NULL");
  }

  if (!columnExists("schedules", "start_notified_at")) {
    db.exec("ALTER TABLE schedules ADD COLUMN start_notified_at TEXT");
  }

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_schedules_guild_starts_at
      ON schedules (guild_id, starts_at);

    CREATE INDEX IF NOT EXISTS idx_schedules_reminders
      ON schedules (reminder_notified_at, starts_at);

    CREATE INDEX IF NOT EXISTS idx_schedules_start_notifications
      ON schedules (start_notified_at, starts_at);
  `);
}
