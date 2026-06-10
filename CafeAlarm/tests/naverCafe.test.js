import test from "node:test";
import assert from "node:assert/strict";

import { fetchCafeData } from "../src/naverCafe.js";

const originalFetch = globalThis.fetch;
const originalConsoleError = console.error;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
  console.error = originalConsoleError;
});

test("fetchCafeData converts Naver Cafe API articles", async () => {
  const requestedUrls = [];

  globalThis.fetch = async (url) => {
    requestedUrls.push(url);

    return {
      ok: true,
      json: async () => ({
        result: {
          articleList: [
            {
              item: {
                articleId: 123,
                cafeId: 456,
                menuName: "Notice",
                subject: "Test article",
                writeDateTimestamp: 1770000000000,
                summary: "Test summary",
              },
            },
          ],
        },
      }),
    };
  };

  const articles = await fetchCafeData("https://naver.example/cafe");

  assert.deepEqual(requestedUrls, ["https://naver.example/cafe"]);
  assert.deepEqual(articles, [
    {
      articleId: 123,
      cafeId: 456,
      menuName: "Notice",
      subject: "Test article",
      writeDateTimestamp: 1770000000000,
      summary: "Test summary",
      url: "https://cafe.naver.com/f-e/cafes/456/articles/123",
    },
  ]);
});

test("fetchCafeData rejects an unsuccessful HTTP response", async () => {
  console.error = () => {};
  globalThis.fetch = async () => ({
    ok: false,
    status: 500,
    statusText: "Internal Server Error",
  });

  await assert.rejects(
    fetchCafeData("https://naver.example/cafe"),
    /Naver Cafe request failed: 500 Internal Server Error/,
  );
});

test("fetchCafeData rejects a response without articleList", async () => {
  console.error = () => {};
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ result: {} }),
  });

  await assert.rejects(
    fetchCafeData("https://naver.example/cafe"),
    /does not include articleList/,
  );
});
