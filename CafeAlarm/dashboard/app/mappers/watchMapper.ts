import { statusLabels } from "../constants/watcherStatus.ts";
import type { ApiWatcher, Watcher } from "../types/watcher.ts";

export const mapWatcher = (watcher: ApiWatcher): Watcher => ({
  id: watcher._id,
  name: watcher.name,
  description: "새로 등록된 감시 대상",
  status: watcher.status,
  statusLabel: statusLabels[watcher.status],
  lastChecked: watcher.lastCheckedAt ?? "아직 확인하지 않음",
  recentActivity:
    watcher.lastError ??
    (watcher.enabled ? "최근 실행 정상" : "감시 일시 중단"),
  pollIntervalSeconds: watcher.pollIntervalSeconds,
  naverCafeUrl: watcher.naverCafeUrl,
  discordWebhookConfigured: watcher.discordWebhookConfigured,
  discordWebhookMasked: watcher.discordWebhookMasked,
  enabled: watcher.enabled,
  lastError: watcher.lastError,
});
