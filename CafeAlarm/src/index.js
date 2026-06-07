import { sendDiscordWebhook } from "./discordWebhook.js";
import { getCafeData } from "./naverCafe.js";
import fs from "fs/promises";

const DATA_PATH = "./data/data.json";

const readSavedArticleIds = async () => {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(file);
    const articlesId = data.map((article) => {
      return article.articleId;
    });
    return articlesId;
  } catch (error) {
    return [];
  }
};

const main = async () => {
  try {
    const savedArticleIds = await readSavedArticleIds();
    const articles = await getCafeData();

    const newArticles = articles.filter((article) => {
      return !savedArticleIds.includes(article.articleId);
    });

    if (newArticles.length > 0) {
      for (const article of newArticles) {
        await sendDiscordWebhook(article);
      }
    }
    await fs.writeFile(DATA_PATH, JSON.stringify(articles), "utf-8");
  } catch (error) {
    console.error(error);
  }
};

main();
