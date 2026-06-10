import { connectMongoDB } from "./mongodb.js";
import { runWatcher } from "./runWatcher.js";
import {
  getDueWatchers,
  markWatcherSuccess,
  markWatcherError,
} from "./watcherStore.js";

const SCHEDULER_TICK_MS = 10_000;

const main = async () => {
  await connectMongoDB();

  const watchers = await getDueWatchers();

  for (const watcher of watchers) {
    try {
      await runWatcher(watcher);
      await markWatcherSuccess(watcher._id);
    } catch (error) {
      console.error(`${watcher.name} 실행 실패`, error);
      await markWatcherError(watcher._id, error);
    }
  }
};

const sleep = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

const start = async () => {
  while (true) {
    await main();
    await sleep(SCHEDULER_TICK_MS);
  }
};

start().catch((error) => {
  console.error("Worker 실행 실패", error);
  process.exit(1);
});
