import type { Watcher } from "../types/watcher";

export const removeWatcherFromList = (
  watchers: Watcher[],
  selectedWatcher: Watcher | null,
  deletedWatcherId: string,
) => {
  const remainingWatchers = watchers.filter(
    (watcher) => watcher.id !== deletedWatcherId,
  );

  return {
    watchers: remainingWatchers,
    selectedWatcher:
      selectedWatcher?.id === deletedWatcherId
        ? (remainingWatchers[0] ?? null)
        : selectedWatcher,
  };
};
