import { sendDiscordWebhook } from "./discordWebhook.js";
import { fetchCafeData } from "./naverCafe.js";
import { getSeenArticleIds, saveSeenArticles } from "./seenArticleStore.js";
import { decryptWebhookUrl } from "./webhookCrypto.js";

export const runWatcher = async (watcher) => {
  const articles = await fetchCafeData(watcher.naverCafeUrl);
  const seenArticleIds = await getSeenArticleIds(watcher._id);

  if (articles.length === 0) {
    throw new Error("가져온 게시글이 없습니다.");
  }

  const newArticles = articles.filter(
    (article) => !seenArticleIds.has(String(article.articleId)),
  );
  if (seenArticleIds.size === 0) {
    await saveSeenArticles(watcher._id, articles);
    return;
  }

  if (newArticles.length > 0) {
    const webhookUrl = decryptWebhookUrl({
      ciphertext: watcher.discordWebhookCiphertext,
      iv: watcher.discordWebhookIv,
      authTag: watcher.discordWebhookAuthTag,
    });

    for (const article of newArticles) {
      await sendDiscordWebhook(webhookUrl, article);
      await saveSeenArticles(watcher._id, [article]);
    }
  }
};
