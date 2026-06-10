import mongoose from "mongoose";
import { encryptWebhookUrl } from "../lib/webhookCrypto.ts";

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("MONGODB_URI is required.");
}

await mongoose.connect(mongodbUri);

const watchers = await mongoose.connection
  .collection("watchers")
  .find({
    discordWebhookUrl: { $type: "string", $ne: "" },
  })
  .toArray();

for (const watcher of watchers) {
  const encryptedWebhook = encryptWebhookUrl(watcher.discordWebhookUrl);

  await mongoose.connection.collection("watchers").updateOne(
    { _id: watcher._id },
    {
      $set: {
        discordWebhookCiphertext: encryptedWebhook.ciphertext,
        discordWebhookIv: encryptedWebhook.iv,
        discordWebhookAuthTag: encryptedWebhook.authTag,
        discordWebhookMasked: encryptedWebhook.maskedUrl,
      },
      $unset: {
        discordWebhookUrl: "",
      },
    },
  );
}

console.log(`Encrypted ${watchers.length} existing webhook URL(s).`);
await mongoose.disconnect();
