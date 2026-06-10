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
    lastError: null,
    pollIntervalSeconds: 60,
    naverCafeUrl: "https://example.com",
    discordWebhookConfigured: true,
    discordWebhookMasked: "https://discord.com/***",
  };

  assert.equal(mapWatcher(apiWatcher).enabled, false);
});

test("maps the latest worker error into the watcher activity", () => {
  const apiWatcher: ApiWatcher = {
    _id: "watcher-id",
    name: "test watcher",
    status: "error",
    enabled: true,
    lastCheckedAt: "2026-06-10T12:00:00.000Z",
    lastError: "Naver Cafe request failed: 403 Forbidden",
    pollIntervalSeconds: 60,
    naverCafeUrl: "https://example.com",
    discordWebhookConfigured: true,
    discordWebhookMasked: "https://discord.com/***",
  };

  const watcher = mapWatcher(apiWatcher);

  assert.equal(watcher.lastError, apiWatcher.lastError);
  assert.equal(watcher.recentActivity, apiWatcher.lastError);
});
