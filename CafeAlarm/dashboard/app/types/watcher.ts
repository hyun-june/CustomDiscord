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
};
