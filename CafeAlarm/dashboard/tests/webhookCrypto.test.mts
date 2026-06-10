import assert from "node:assert/strict";
import test from "node:test";
import {
  decryptWebhookUrl,
  encryptWebhookUrl,
} from "../lib/webhookCrypto.ts";

const encryptionKey = Buffer.alloc(32, 7).toString("base64");
const webhookUrl =
  "https://discord.com/api/webhooks/123456789/secret-webhook-token";

test("encrypts a webhook without storing the plaintext URL", () => {
  const encrypted = encryptWebhookUrl(webhookUrl, encryptionKey);

  assert.notEqual(encrypted.ciphertext, webhookUrl);
  assert.equal(encrypted.maskedUrl, "discord.com/api/webhooks/1234••••");
  assert.equal(
    decryptWebhookUrl(encrypted, encryptionKey),
    webhookUrl,
  );
});

test("rejects an invalid encryption key", () => {
  assert.throws(
    () => encryptWebhookUrl(webhookUrl, "invalid-key"),
    /32-byte base64/,
  );
});
