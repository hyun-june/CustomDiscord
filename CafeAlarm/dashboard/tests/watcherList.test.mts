import assert from "node:assert/strict";
import test from "node:test";
import {
  removeWatcherFromList,
  replaceWatcherInList,
} from "../app/utils/watcherList.ts";
import type { Watcher } from "../app/types/watcher.ts";

const createWatcher = (id: string): Watcher => ({
  id,
  name: id,
  description: "",
  status: "paused",
  statusLabel: "중지",
  lastChecked: "",
  recentActivity: "",
  pollIntervalSeconds: 60,
  naverCafeUrl: "",
  discordWebhookConfigured: true,
  discordWebhookMasked: "",
  enabled: true,
});

test("selects the first remaining watcher when the selected watcher is deleted", () => {
  const first = createWatcher("first");
  const selected = createWatcher("selected");

  const result = removeWatcherFromList([first, selected], selected, "selected");

  assert.deepEqual(result.watchers, [first]);
  assert.equal(result.selectedWatcher, first);
});

test("keeps the current selection when another watcher is deleted", () => {
  const selected = createWatcher("selected");
  const other = createWatcher("other");

  const result = removeWatcherFromList([selected, other], selected, "other");

  assert.deepEqual(result.watchers, [selected]);
  assert.equal(result.selectedWatcher, selected);
});

test("replaces a watcher and keeps the selected watcher in sync", () => {
  const selected = createWatcher("selected");
  const paused = { ...selected, enabled: false, status: "paused" as const };

  const result = replaceWatcherInList([selected], selected, paused);

  assert.deepEqual(result.watchers, [paused]);
  assert.equal(result.selectedWatcher, paused);
});
