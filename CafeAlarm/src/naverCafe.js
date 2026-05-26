export const getCafeData = async () => {
  try {
    const response = await fetch(
      "https://apis.naver.com/cafe-web/cafe-boardlist-api/v1/cafes/31719263/menus/0/articles?page=1&pageSize=15&sortBy=TIME&viewType=L",
    );
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
      };
    });
  } catch (error) {
    console.error(error);
  }
};
