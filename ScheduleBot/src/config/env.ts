import "dotenv/config";

const requiredEnv = ["DISCORD_TOKEN", "DISCORD_CLIENT_ID"] as const;

function getRequiredEnv(key: (typeof requiredEnv)[number]) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  discordToken: getRequiredEnv("DISCORD_TOKEN"),
  discordClientId: getRequiredEnv("DISCORD_CLIENT_ID"),
  discordGuildId: process.env.DISCORD_GUILD_ID
};
