import { existsSync, readFileSync } from 'node:fs';

function loadDotEnv(path = '.env') {
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separator = trimmed.indexOf('=');
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function readInteger(name, fallback, { min = 1 } = {}) {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < min) {
    throw new Error(`${name} must be an integer greater than or equal to ${min}.`);
  }

  return parsed;
}

function readBoolean(name, fallback = false) {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'y'].includes(raw.toLowerCase());
}

export function loadConfig() {
  loadDotEnv();

  const required = ['DISCORD_WEBHOOK_URL', 'NAVER_CAFE_LIST_URL'];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
    naverCafeListUrl: process.env.NAVER_CAFE_LIST_URL,
    naverCookie: process.env.NAVER_COOKIE || '',
    pollIntervalSeconds: readInteger('POLL_INTERVAL_SECONDS', 60, { min: 10 }),
    maxArticlesPerPoll: readInteger('MAX_ARTICLES_PER_POLL', 20, { min: 1 }),
    notifyExistingOnStart: readBoolean('NOTIFY_EXISTING_ON_START', false),
    stateFile: process.env.STATE_FILE || 'data/seen-articles.json'
  };
}
