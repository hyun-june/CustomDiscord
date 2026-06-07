const buildArticleUrl = (cafeId, articleId) => {
  return `https://cafe.naver.com/f-e/cafes/${cafeId}/articles/${articleId}`;
};

export const getCafeData = async () => {
  try {
    const response = await fetch(process.env.NAVER_CAFE_URL);
    const data = await response.json();

    const articles = data.result.articleList.map((article) => {
      const {
        articleId,
        cafeId,
        menuName,
        subject,
        writeDateTimestamp,
        summary,
      } = article.item;

      return {
        articleId,
        cafeId,
        menuName,
        subject,
        writeDateTimestamp,
        summary,
        url: buildArticleUrl(cafeId, articleId),
      };
    });

    return articles;
  } catch (error) {
    console.error(error);
    return [];
  }
};
