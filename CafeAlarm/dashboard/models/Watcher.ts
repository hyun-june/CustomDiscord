import mongoose, { Schema } from "mongoose";

const watcherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    naverCafeUrl: {
      type: String,
      required: true,
    },
    discordWebhookUrl: {
      type: String,
      select: false,
    },
    discordWebhookCiphertext: {
      type: String,
      select: false,
    },
    discordWebhookIv: {
      type: String,
      select: false,
    },
    discordWebhookAuthTag: {
      type: String,
      select: false,
    },
    discordWebhookMasked: {
      type: String,
      default: "Discord webhook configured",
    },
    pollIntervalSeconds: {
      type: Number,
      required: true,
      min: 60,
      default: 60,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["healthy", "error", "paused"],
      default: "paused",
    },
    lastCheckedAt: {
      type: Date,
      default: null,
    },
    lastError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const WatcherModel =
  mongoose.models.Watcher || mongoose.model("Watcher", watcherSchema);
