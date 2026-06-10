import assert from "node:assert/strict";
import test from "node:test";
import { mapWatcher } from "../app/mappers/watchMapper.ts";
import type { ApiWatcher } from "../app/types/watcher.ts";

test("maps the enabled state returned by the API", () => {
  const apiWatcher: ApiWatcher = {
    _id: "watcher-id",
    name: "test watcher",
    status: "paused",
    enabled: false,
    lastCheckedAt: null,
    pollIntervalSeconds: 60,
    naverCafeUrl: "https://example.com",
    discordWebhookConfigured: true,
    discordWebhookMasked: "https://discord.com/***",
  };

  assert.equal(mapWatcher(apiWatcher).enabled, false);
});
