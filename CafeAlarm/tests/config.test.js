import test from "node:test";
import assert from "node:assert/strict";

import { loadConfig } from "../src/config.js";

const CONFIG_ENV_NAMES = [
  "DISCORD_WEBHOOK_URL",
  "NAVER_CAFE_URL",
  "POLL_INTERVAL_SECONDS",
  "DATA_PATH",
];

const withEnvironment = async (values, callback) => {
  const originalValues = Object.fromEntries(
    CONFIG_ENV_NAMES.map((name) => [name, process.env[name]]),
  );

  try {
    for (const name of CONFIG_ENV_NAMES) {
      delete process.env[name];
    }

    Object.assign(process.env, values);
    await callback();
  } finally {
    for (const name of CONFIG_ENV_NAMES) {
      const originalValue = originalValues[name];

      if (originalValue === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = originalValue;
      }
    }
  }
};

test("loadConfig returns validated environment values", async () => {
  await withEnvironment(
    {
      DISCORD_WEBHOOK_URL: "https://discord.example/webhook",
      NAVER_CAFE_URL: "https://naver.example/cafe",
      POLL_INTERVAL_SECONDS: "60",
      DATA_PATH: "./data/test.json",
    },
    () => {
      assert.deepEqual(loadConfig(), {
        discordWebhookUrl: "https://discord.example/webhook",
        naverCafeUrl: "https://naver.example/cafe",
        pollIntervalSeconds: 60,
        dataPath: "./data/test.json",
      });
    },
  );
});

test("loadConfig throws when required environment values are missing", async () => {
  await withEnvironment(
    {
      POLL_INTERVAL_SECONDS: "60",
      DATA_PATH: "./data/test.json",
    },
    () => {
      assert.throws(
        () => loadConfig(),
        (error) =>
          error.message.includes("DISCORD_WEBHOOK_URL") &&
          error.message.includes("NAVER_CAFE_URL"),
      );
    },
  );
});

test("loadConfig throws when poll interval is not a valid number", async () => {
  await withEnvironment(
    {
      DISCORD_WEBHOOK_URL: "https://discord.example/webhook",
      NAVER_CAFE_URL: "https://naver.example/cafe",
      POLL_INTERVAL_SECONDS: "not-a-number",
      DATA_PATH: "./data/test.json",
    },
    () => {
      assert.throws(() => loadConfig());
    },
  );
});

test("loadConfig throws when poll interval is less than 60 seconds", async () => {
  await withEnvironment(
    {
      DISCORD_WEBHOOK_URL: "https://discord.example/webhook",
      NAVER_CAFE_URL: "https://naver.example/cafe",
      POLL_INTERVAL_SECONDS: "59",
      DATA_PATH: "./data/test.json",
    },
    () => {
      assert.throws(() => loadConfig());
    },
  );
});
