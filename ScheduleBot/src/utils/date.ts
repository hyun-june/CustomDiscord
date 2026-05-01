const timeZone = "Asia/Seoul";

export function parseKoreanDateTime(date: string, time: string) {
  const dateMatch = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/.exec(date);
  const timeMatch = /^(?<hour>\d{1,2}):(?<minute>\d{2})$/.exec(time);

  if (!dateMatch?.groups || !timeMatch?.groups) {
    return null;
  }

  const year = Number(dateMatch.groups.year);
  const month = Number(dateMatch.groups.month);
  const day = Number(dateMatch.groups.day);
  const hour = Number(timeMatch.groups.hour);
  const minute = Number(timeMatch.groups.minute);

  if (month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  const startsAt = new Date(Date.UTC(year, month - 1, day, hour - 9, minute));

  if (Number.isNaN(startsAt.getTime())) {
    return null;
  }

  return startsAt;
}

export function formatKoreanDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

export function getTodayRangeInKorea(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  const start = new Date(Date.UTC(year, month - 1, day, -9, 0));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return { start, end };
}
