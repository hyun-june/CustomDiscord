import { createDecipheriv } from "node:crypto";

const ALGORITHM = "aes-256-gcm";

const getEncryptionKey = (encodedKey = process.env.WEBHOOK_ENCRYPTION_KEY) => {
  const key = Buffer.from(encodedKey ?? "", "base64");

  if (key.length !== 32) {
    throw new Error(
      "Encryption key must be 32 bytes (256 bits) when decoded from base64.",
    );
  }

  return key;
};

export const decryptWebhookUrl = (encryptedWebhook, encodedKey) => {
  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKey(encodedKey),
    Buffer.from(encryptedWebhook.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(encryptedWebhook.authTag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedWebhook.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
};
