const BOARD_LIST_API_PREFIX =
  "https://apis.naver.com/cafe-web/cafe-boardlist-api/v1";

export class NaverCafeUrlError extends Error {
  constructor() {
    super("네이버 카페 메뉴 URL을 입력해주세요.");
    this.name = "NaverCafeUrlError";
  }
}

const buildBoardListApiUrl = (
  cafeId: string,
  menuId: string,
  pageSize = "15",
) => {
  const apiUrl = new URL(
    `${BOARD_LIST_API_PREFIX}/cafes/${cafeId}/menus/${menuId}/articles`,
  );
  apiUrl.searchParams.set("page", "1");
  apiUrl.searchParams.set("pageSize", pageSize);
  apiUrl.searchParams.set("sortBy", "TIME");
  apiUrl.searchParams.set("viewType", "L");
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
      return buildBoardListApiUrl(cafeId, menuId, perPage);
    }
  }

  if (url.hostname === "apis.naver.com") {
    const match = url.pathname.match(
      /^\/cafe-web\/cafe-boardlist-api\/v1\/cafes\/(\d+)\/menus\/(\d+)\/articles\/?$/,
    );

    if (match) {
      return buildBoardListApiUrl(
        match[1],
        match[2],
        url.searchParams.get("pageSize") ?? "15",
      );
    }
  }

  if (url.hostname === "cafe.naver.com") {
    const match = url.pathname.match(/^\/f-e\/cafes\/(\d+)\/menus\/(\d+)\/?$/);

    if (match) {
      return buildBoardListApiUrl(match[1], match[2]);
    }
  }

  throw new NaverCafeUrlError();
};
