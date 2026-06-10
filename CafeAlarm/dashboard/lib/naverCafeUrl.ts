const ARTICLE_LIST_API_URL =
  "https://apis.naver.com/cafe-web/cafe2/ArticleListV2.json";

export class NaverCafeUrlError extends Error {
  constructor() {
    super("네이버 카페 메뉴 URL을 입력해주세요.");
    this.name = "NaverCafeUrlError";
  }
}

const buildArticleListApiUrl = (
  cafeId: string,
  menuId: string,
  perPage = "15",
) => {
  const apiUrl = new URL(ARTICLE_LIST_API_URL);
  apiUrl.searchParams.set("search.clubid", cafeId);
  apiUrl.searchParams.set("search.menuid", menuId);
  apiUrl.searchParams.set("search.page", "1");
  apiUrl.searchParams.set("search.perPage", perPage);
  return apiUrl.toString();
};

export const normalizeNaverCafeUrl = (input: string) => {
  let url: URL;

  try {
    url = new URL(input.trim());
  } catch {
    throw new NaverCafeUrlError();
  }

  if (
    url.hostname === "apis.naver.com" &&
    url.pathname === "/cafe-web/cafe2/ArticleListV2.json"
  ) {
    const cafeId = url.searchParams.get("search.clubid");
    const menuId = url.searchParams.get("search.menuid");
    const perPage = url.searchParams.get("search.perPage") ?? "15";

    if (cafeId && menuId) {
      return buildArticleListApiUrl(cafeId, menuId, perPage);
    }
  }

  if (url.hostname === "cafe.naver.com") {
    const match = url.pathname.match(/^\/f-e\/cafes\/(\d+)\/menus\/(\d+)\/?$/);

    if (match) {
      return buildArticleListApiUrl(match[1], match[2]);
    }
  }

  throw new NaverCafeUrlError();
};
