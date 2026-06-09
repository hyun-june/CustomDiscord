import test from "node:test";
import assert from "node:assert/strict";

import { sendDiscordWebhook } from "../src/discordWebhook.js";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("sendDiscordWebhook sends an embed for an article", async () => {
  const requests = [];
  const article = {
    subject: "Test article",
    url: "https://cafe.example/articles/123",
    summary: "Test summary",
    writeDateTimestamp: Date.parse("2026-06-09T00:00:00.000Z"),
  };

  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return { ok: true };
  };

  await sendDiscordWebhook("https://discord.example/webhook", article);

  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "https://discord.example/webhook");
  assert.equal(requests[0].options.method, "POST");
  assert.deepEqual(requests[0].options.headers, {
    "content-type": "application/json",
  });
  assert.deepEqual(JSON.parse(requests[0].options.body), {
    embeds: [
      {
        title: "Test article",
        url: "https://cafe.example/articles/123",
        description: "Test summary",
        color: 0x03c75a,
        timestamp: "2026-06-09T00:00:00.000Z",
      },
    ],
  });
});

test("sendDiscordWebhook rejects an unsuccessful response", async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 400,
    text: async () => "Invalid webhook payload",
  });

  await assert.rejects(
    sendDiscordWebhook("https://discord.example/webhook", {
      subject: "Test article",
      url: "https://cafe.example/articles/123",
      summary: "Test summary",
      writeDateTimestamp: Date.parse("2026-06-09T00:00:00.000Z"),
    }),
    /Discord webhook failed: 400 Invalid webhook payload/,
  );
});
