import { loadConfig } from "./config.js";
import { connectMongoDB } from "./mongodb.js";
import { runWatcher } from "./runWatcher.js";
import { getEnabledWatchers } from "./watcherStore.js";

const config = loadConfig();
const main = async () => {
  await connectMongoDB();

  const watchers = await getEnabledWatchers();

  for (const watcher of watchers) {
    try {
      await runWatcher(watcher);
    } catch (error) {
      console.error(`${watcher.name} 실행 실패`, error);
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
    await sleep(config.pollIntervalSeconds * 1000);
  }
};

start().catch((error) => {
  console.error("Worker 실행 실패", error);
  process.exit(1);
});
