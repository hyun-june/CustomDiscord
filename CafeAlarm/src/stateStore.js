import fs from "fs/promises";

export const readSavedArticleIds = async (dataPath) => {
  try {
    const file = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(file);

    if (!Array.isArray(data)) {
      throw new Error("저장된 게시글 데이터가 배열이 아닙니다.");
    }
    const articlesId = data.map((article) => {
      return article.articleId;
    });
    return { isFirstRun: false, articleIds: articlesId };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { isFirstRun: true, articleIds: [] };
    }

    throw error;
  }
};

export const saveArticles = async (dataPath, articles) => {
  await fs.writeFile(dataPath, JSON.stringify(articles, null, 2), "utf-8");
};
