const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const BOARD_API_BASE_URL = "https://apis.naver.com/cafe-web/cafe-boardlist-api";

const ENTITY_MAP = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeHtmlEntities(value) {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    }

    if (entity.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    }

    return ENTITY_MAP[entity] ?? match;
  });
}

function stripTags(value) {
  return decodeHtmlEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getAttribute(tag, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*(['"])(.*?)\\1`, "i");
  return tag.match(pattern)?.[2] ?? "";
}

function extractArticleId(href) {
  const decodedHref = decodeHtmlEntities(href);

  try {
    const url = new URL(decodedHref, "https://cafe.naver.com");
    const articleId = url.searchParams.get("articleid");
    if (articleId) {
      return articleId;
    }
  } catch {
    // Fall through to path matching.
  }

  return decodedHref.match(/\/articles\/(\d+)/)?.[1] ?? null;
}

function normalizeArticleUrl(href, listUrl) {
  const decodedHref = decodeHtmlEntities(href);
  return new URL(decodedHref, listUrl).toString();
}

function buildArticleUrl(cafeId, articleId) {
  return `https://cafe.naver.com/f-e/cafes/${cafeId}/articles/${articleId}`;
}

function extractCafeBoardInfo(listUrl) {
  const url = new URL(listUrl);
  const clubId =
    url.searchParams.get("search.clubid") ?? url.searchParams.get("clubid");
  const menuId =
    url.searchParams.get("search.menuid") ?? url.searchParams.get("menuid");

  if (clubId && menuId) {
    return { cafeId: clubId, menuId };
  }

  const pathMatch = url.pathname.match(/\/cafes\/(\d+)\/menus\/(\d+)/);
  if (pathMatch) {
    return {
      cafeId: pathMatch[1],
      menuId: pathMatch[2],
    };
  }

  return null;
}

export function parseArticleList(html, listUrl) {
  const articles = [];
  const seen = new Set();
  const anchorPattern =
    /<a\b[^>]*href\s*=\s*(['"])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;

  for (const match of html.matchAll(anchorPattern)) {
    const fullTag = match[0];
    const href = match[2];
    const articleId = extractArticleId(href);
    if (!articleId || seen.has(articleId)) {
      continue;
    }

    const titleFromBody = stripTags(match[3]);
    const titleFromAttribute = stripTags(
      getAttribute(fullTag, "title") || getAttribute(fullTag, "aria-label"),
    );
    const title =
      titleFromBody ||
      titleFromAttribute ||
      `New Naver Cafe article #${articleId}`;

    seen.add(articleId);
    articles.push({
      id: articleId,
      title,
      url: normalizeArticleUrl(href, listUrl),
    });
  }

  return articles;
}

export async function fetchCafeHtml({ listUrl, cookie = "" }) {
  const headers = {
    "user-agent": DEFAULT_USER_AGENT,
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
  };

  if (cookie) {
    headers.cookie = cookie;
  }

  const response = await fetch(listUrl, { headers });
  if (!response.ok) {
    throw new Error(
      `Naver Cafe request failed: ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();
  return {
    html,
    status: response.status,
    statusText: response.statusText,
    finalUrl: response.url,
    contentType: response.headers.get("content-type") ?? "",
  };
}

export async function fetchCafeArticlesFromApi({
  listUrl,
  cookie = "",
  maxArticles = 20,
}) {
  const boardInfo = extractCafeBoardInfo(listUrl);
  if (!boardInfo) {
    return null;
  }

  const apiUrl = new URL(
    `${BOARD_API_BASE_URL}/v1/cafes/${boardInfo.cafeId}/menus/${boardInfo.menuId}/articles`,
  );
  apiUrl.searchParams.set("boardType", "L");
  apiUrl.searchParams.set("page", "1");
  apiUrl.searchParams.set("pageSize", String(maxArticles));

  const headers = {
    "user-agent": DEFAULT_USER_AGENT,
    accept: "application/json, text/plain, */*",
    referer: listUrl,
    origin: "https://cafe.naver.com",
  };

  if (cookie) {
    headers.cookie = cookie;
  }

  const response = await fetch(apiUrl, { headers });
  if (!response.ok) {
    throw new Error(
      `Naver Cafe API request failed: ${response.status} ${response.statusText}`,
    );
  }

  const payload = await response.json();
  const articleList = payload?.result?.articleList ?? [];

  return articleList
    .filter((entry) => entry?.type === "ARTICLE" && entry.item?.articleId)
    .map(({ item }) => ({
      id: String(item.articleId),
      title:
        item.subject ||
        item.title ||
        `New Naver Cafe article #${item.articleId}`,
      url:
        item.cafeBookUrl ||
        buildArticleUrl(item.cafeId ?? boardInfo.cafeId, item.articleId),
      writtenAt: item.writeDateTimestamp
        ? new Date(item.writeDateTimestamp).toISOString()
        : undefined,
    }))
    .slice(0, maxArticles);
}

export async function fetchCafeArticles({
  listUrl,
  cookie = "",
  maxArticles = 20,
}) {
  const apiArticles = await fetchCafeArticlesFromApi({
    listUrl,
    cookie,
    maxArticles,
  });
  if (apiArticles) {
    return apiArticles;
  }

  const { html } = await fetchCafeHtml({ listUrl, cookie });
  return parseArticleList(html, listUrl).slice(0, maxArticles);
}
