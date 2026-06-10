import mongoose from "mongoose";

const watcherSchema = new mongoose.Schema(
  {
    name: String,
    naverCafeUrl: String,
    discordWebhookCiphertext: String,
    discordWebhookIv: String,
    discordWebhookAuthTag: String,
    discordWebhookMasked: String,
    pollIntervalSeconds: Number,
    enabled: Boolean,
    status: String,
    lastCheckedAt: Date,
    lastError: String,
  },
  {
    timestamps: true,
  },
);

const WatcherModel =
  mongoose.models.Watcher || mongoose.model("Watcher", watcherSchema);

export const getDueWatchers = async () => {
  const watchers = await WatcherModel.find({ enabled: true }).lean();
  const now = Date.now();

  return watchers.filter((watcher) => {
    const pollIntervalSeconds = Number(watcher.pollIntervalSeconds);

    if (!Number.isFinite(pollIntervalSeconds) || pollIntervalSeconds < 60) {
      return false;
    }
    if (!watcher.lastCheckedAt) {
      return true;
    }

    const nextRunAt =
      new Date(watcher.lastCheckedAt).getTime() +
      pollIntervalSeconds * 1000;

    return nextRunAt <= now;
  });
};

export const markWatcherSuccess = async (watcherId) => {
  await WatcherModel.findOneAndUpdate(
    { _id: watcherId, enabled: true },
    {
      status: "healthy",
      lastCheckedAt: new Date(),
      lastError: null,
    },
  );
};

export const markWatcherError = async (watcherId, error) => {
  await WatcherModel.findOneAndUpdate(
    { _id: watcherId, enabled: true },
    {
      status: "error",
      lastCheckedAt: new Date(),
      lastError: error instanceof Error ? error.message : String(error),
    },
  );
};
