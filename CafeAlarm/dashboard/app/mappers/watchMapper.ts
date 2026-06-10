import { statusLabels } from "../constants/watcherStatus";
import type { ApiWatcher, Watcher } from "../types/watcher";

export const mapWatcher = (watcher: ApiWatcher): Watcher => ({
  id: watcher._id,
  name: watcher.name,
  description: "새로 등록된 감시 대상",
  status: watcher.status,
  statusLabel: statusLabels[watcher.status],
  lastChecked: watcher.lastCheckedAt ?? "아직 확인하지 않음",
  recentActivity: "감시 준비 중",
  pollIntervalSeconds: watcher.pollIntervalSeconds,
  naverCafeUrl: watcher.naverCafeUrl,
  discordWebhookConfigured: watcher.discordWebhookConfigured,
  discordWebhookMasked: watcher.discordWebhookMasked,
});
