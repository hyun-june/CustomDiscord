import type { WatcherStatus } from "../types/watcher";

export const statusLabels: Record<WatcherStatus, string> = {
  healthy: "정상",
  error: "오류",
  paused: "중지",
};

export const statusDotClasses: Record<WatcherStatus, string> = {
  healthy: "bg-emerald-500",
  error: "bg-rose-500",
  paused: "bg-zinc-400",
};

export const statusBadgeClasses: Record<WatcherStatus, string> = {
  healthy: "text-emerald-700 bg-emerald-50 border-emerald-200",
  error: "text-rose-700 bg-rose-50 border-rose-200",
  paused: "text-zinc-600 bg-zinc-100 border-zinc-200",
};
