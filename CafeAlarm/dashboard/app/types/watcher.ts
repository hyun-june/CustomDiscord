export type WatcherStatus = "healthy" | "error" | "paused";

export type Watcher = {
  id: string;
  name: string;
  description: string;
  status: WatcherStatus;
  statusLabel: string;
  lastChecked: string;
  recentActivity: string;
  pollIntervalSeconds: number;
  naverCafeUrl: string;
  discordWebhookConfigured: boolean;
  discordWebhookMasked: string;
};

export type CreateWatcherInput = {
  name: string;
  naverCafeUrl: string;
  discordWebhookUrl: string;
  pollIntervalSeconds: number;
};

export type ApiWatcher = {
  _id: string;
  name: string;
  status: WatcherStatus;
  lastCheckedAt: string | null;
  pollIntervalSeconds: number;
  naverCafeUrl: string;
  discordWebhookConfigured: boolean;
  discordWebhookMasked: string;
};
