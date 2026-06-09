import { loadConfig } from "./config.js";
import { sendDiscordWebhook } from "./discordWebhook.js";
import { getCafeData } from "./naverCafe.js";
import { readSavedArticleIds, saveArticles } from "./stateStore.js";
import fs from "fs/promises";

const config = loadConfig();

const main = async () => {
  try {
    const savedArticleIds = await readSavedArticleIds(config.dataPath);
    const articles = await getCafeData(config.naverCafeUrl);

    if (articles.length === 0) {
      throw new Error("가져온 게시글이 없습니다. 기존 데이터를 유지합니다.");
    }

    if (savedArticleIds.isFirstRun) {
      console.log("첫 실행은 데이터만 저장합니다.");
      await saveArticles(config.dataPath, articles);
      return;
    }

    const newArticles = articles.filter((article) => {
      return !savedArticleIds.articleIds.includes(article.articleId);
    });

    if (newArticles.length > 0) {
      for (const article of newArticles) {
        await sendDiscordWebhook(config.discordWebhookUrl, article);
      }
    }
    await saveArticles(config.dataPath, articles);
  } catch (error) {
    console.error(error);
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

start();
