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

export const replaceWatcherInList = (
  watchers: Watcher[],
  selectedWatcher: Watcher | null,
  updatedWatcher: Watcher,
) => ({
  watchers: watchers.map((watcher) =>
    watcher.id === updatedWatcher.id ? updatedWatcher : watcher,
  ),
  selectedWatcher:
    selectedWatcher?.id === updatedWatcher.id ? updatedWatcher : selectedWatcher,
});
