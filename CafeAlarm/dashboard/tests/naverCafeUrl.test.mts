import assert from "node:assert/strict";
import test from "node:test";
import { normalizeNaverCafeUrl } from "../lib/naverCafeUrl.ts";

test("converts a Naver Cafe menu URL into the article list API URL", () => {
  const result = normalizeNaverCafeUrl(
    "https://cafe.naver.com/f-e/cafes/31654901/menus/14?viewType=L",
  );

  assert.equal(
    result,
    "https://apis.naver.com/cafe-web/cafe2/ArticleListV2.json?search.clubid=31654901&search.menuid=14&search.page=1&search.perPage=15",
  );
});

test("accepts and normalizes an existing article list API URL", () => {
  const result = normalizeNaverCafeUrl(
    "https://apis.naver.com/cafe-web/cafe2/ArticleListV2.json?search.menuid=14&search.clubid=31654901&search.perPage=30",
  );

  assert.equal(
    result,
    "https://apis.naver.com/cafe-web/cafe2/ArticleListV2.json?search.clubid=31654901&search.menuid=14&search.page=1&search.perPage=30",
  );
});

test("rejects a URL that does not identify a Cafe menu", () => {
  assert.throws(
    () => normalizeNaverCafeUrl("https://cafe.naver.com/f-e/cafes/31654901"),
    /메뉴 URL/,
  );
});
