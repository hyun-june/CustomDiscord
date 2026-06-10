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

export const getEnabledWatchers = async () => {
  return WatcherModel.find({ enabled: true }).lean();
};
