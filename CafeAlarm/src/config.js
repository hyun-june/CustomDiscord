const REQUIRED_ENV_NAMES = [
  "DISCORD_WEBHOOK_URL",
  "NAVER_CAFE_URL",
  "POLL_INTERVAL_SECONDS",
  "DATA_PATH",
];

export const loadConfig = () => {
  const missingEnvNames = REQUIRED_ENV_NAMES.filter((name) => {
    return !process.env[name];
  });
  if (missingEnvNames.length > 0) {
    throw new Error(`필수 환경변수가 없습니다: ${missingEnvNames.join(", ")}`);
  }

  const pollIntervalSeconds = Number(process.env.POLL_INTERVAL_SECONDS ?? 60);
  if (!Number.isFinite(pollIntervalSeconds) || pollIntervalSeconds < 60) {
    throw new Error("POLL_INTERVAL_SECONDS는 60 이상의 숫자여야 합니다.");
  }

  return {
    naverCafeUrl: process.env.NAVER_CAFE_URL,
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
    pollIntervalSeconds,
    dataPath: process.env.DATA_PATH || "./data/data.json",
  };
};
