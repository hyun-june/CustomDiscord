import { loadConfig } from './config.js';
import { sendDiscordArticleAlert } from './discordWebhook.js';
import { fetchCafeArticles } from './naverCafe.js';
import { loadSeenArticleIds, saveSeenArticleIds } from './stateStore.js';

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function pollOnce(config, seenArticleIds, isFirstPoll) {
  const articles = await fetchCafeArticles({
    listUrl: config.naverCafeListUrl,
    cookie: config.naverCookie,
    maxArticles: config.maxArticlesPerPoll
  });

  const newArticles = articles.filter((article) => !seenArticleIds.has(article.id));
  for (const article of articles) {
    seenArticleIds.add(article.id);
  }

  saveSeenArticleIds(config.stateFile, seenArticleIds);

  if (isFirstPoll && !config.notifyExistingOnStart) {
    console.log(`Seeded ${newArticles.length} existing article(s). New alerts start now.`);
    return;
  }

  for (const article of newArticles.reverse()) {
    await sendDiscordArticleAlert(config.discordWebhookUrl, article);
    console.log(`Sent Discord alert for article ${article.id}: ${article.title}`);
  }

  if (newArticles.length === 0) {
    console.log('No new articles.');
  }
}

async function main() {
  const config = loadConfig();
  const seenArticleIds = loadSeenArticleIds(config.stateFile);
  let isFirstPoll = seenArticleIds.size === 0;

  console.log('Watching Naver Cafe article list.');
  console.log(`Poll interval: ${config.pollIntervalSeconds}s`);

  while (true) {
    try {
      await pollOnce(config, seenArticleIds, isFirstPoll);
      isFirstPoll = false;
    } catch (error) {
      console.error(error);
    }

    await sleep(config.pollIntervalSeconds * 1000);
  }
}

main();
