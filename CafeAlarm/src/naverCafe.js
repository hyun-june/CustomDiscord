const buildArticleUrl = (cafeId, articleId) => {
  return `https://cafe.naver.com/f-e/cafes/${cafeId}/articles/${articleId}`;
};

export const fetchCafeData = async (naverCafeUrl) => {
  try {
    const response = await fetch(naverCafeUrl);

    if (!response.ok) {
      throw new Error(
        `Naver Cafe request failed: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();

    if (!Array.isArray(data?.result?.articleList)) {
      throw new Error("Naver Cafe response does not include articleList.");
    }

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
    throw error;
  }
};
