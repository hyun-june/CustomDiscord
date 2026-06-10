import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";

export class WebhookEncryptionConfigError extends Error {
  constructor() {
    super("WEBHOOK_ENCRYPTION_KEY must be a 32-byte base64 value.");
    this.name = "WebhookEncryptionConfigError";
  }
}

export type EncryptedWebhook = {
  ciphertext: string;
  iv: string;
  authTag: string;
  maskedUrl: string;
};

const getEncryptionKey = (encodedKey = process.env.WEBHOOK_ENCRYPTION_KEY) => {
  const key = Buffer.from(encodedKey ?? "", "base64");

  if (key.length !== 32) {
    throw new WebhookEncryptionConfigError();
  }

  return key;
};

const maskWebhookUrl = (webhookUrl: string) => {
  try {
    const url = new URL(webhookUrl);
    const webhookId = url.pathname.split("/").filter(Boolean).at(-2);

    if (webhookId) {
      return `${url.hostname}/api/webhooks/${webhookId.slice(0, 4)}••••`;
    }
  } catch {
    // Input validation happens before this function is called by the API.
  }

  return "Discord webhook configured";
};

export const encryptWebhookUrl = (
  webhookUrl: string,
  encodedKey?: string,
): EncryptedWebhook => {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(encodedKey), iv);
  const ciphertext = Buffer.concat([
    cipher.update(webhookUrl, "utf8"),
    cipher.final(),
  ]);

  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    maskedUrl: maskWebhookUrl(webhookUrl),
  };
};

export const decryptWebhookUrl = (
  encryptedWebhook: EncryptedWebhook,
  encodedKey?: string,
) => {
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
