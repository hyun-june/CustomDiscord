import { mkdirSync, writeFileSync } from 'node:fs';

import { loadConfig } from './config.js';
import { fetchCafeArticlesFromApi, fetchCafeHtml, parseArticleList } from './naverCafe.js';

const DEBUG_HTML_PATH = 'data/naver-cafe-debug.html';

function hasAny(html, patterns) {
  return patterns.some((pattern) => pattern.test(html));
}

const config = loadConfig();
const result = await fetchCafeHtml({
  listUrl: config.naverCafeListUrl,
  cookie: config.naverCookie
});
const articles = parseArticleList(result.html, config.naverCafeListUrl);
const apiArticles = await fetchCafeArticlesFromApi({
  listUrl: config.naverCafeListUrl,
  cookie: config.naverCookie,
  maxArticles: config.maxArticlesPerPoll
});

mkdirSync('data', { recursive: true });
writeFileSync(DEBUG_HTML_PATH, result.html);

console.log(`Status: ${result.status} ${result.statusText}`);
console.log(`Final URL: ${result.finalUrl}`);
console.log(`Content-Type: ${result.contentType || '(empty)'}`);
console.log(`HTML length: ${result.html.length}`);
console.log(`Parsed articles: ${articles.length}`);
console.log(`API articles: ${apiArticles?.length ?? 'URL does not include cafe/menu IDs'}`);
console.log(`Saved HTML: ${DEBUG_HTML_PATH}`);

if (hasAny(result.html, [/로그인/i, /login/i, /권한이 없습니다/i, /가입/i])) {
  console.log('Hint: the fetched HTML contains login/permission-related text.');
}

for (const article of articles.slice(0, 5)) {
  console.log(`- HTML ${article.id}: ${article.title}`);
}

for (const article of (apiArticles ?? []).slice(0, 5)) {
  console.log(`- API ${article.id}: ${article.title}`);
}
