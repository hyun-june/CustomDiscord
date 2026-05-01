import test from 'node:test';
import assert from 'node:assert/strict';

import { parseArticleList } from '../src/naverCafe.js';

test('parseArticleList extracts classic Naver Cafe article links', () => {
  const html = `
    <a class="article" href="/ArticleRead.nhn?clubid=12345678&amp;articleid=111&amp;menuid=1">
      첫 번째 글
    </a>
    <a class="article" href="/ArticleRead.nhn?clubid=12345678&amp;articleid=112&amp;menuid=1">
      두 번째 &amp; 글
    </a>
  `;

  const articles = parseArticleList(html, 'https://cafe.naver.com/ArticleList.nhn?search.clubid=12345678');

  assert.deepEqual(
    articles.map((article) => ({ id: article.id, title: article.title })),
    [
      { id: '111', title: '첫 번째 글' },
      { id: '112', title: '두 번째 & 글' }
    ]
  );
  assert.equal(
    articles[0].url,
    'https://cafe.naver.com/ArticleRead.nhn?clubid=12345678&articleid=111&menuid=1'
  );
});

test('parseArticleList extracts modern cafe article links once', () => {
  const html = `
    <a href="https://cafe.naver.com/ca-fe/cafes/12345678/articles/200?boardType=L">
      <span>새 글 제목</span>
    </a>
    <a href="https://cafe.naver.com/ca-fe/cafes/12345678/articles/200?boardType=L">
      duplicate
    </a>
  `;

  const articles = parseArticleList(html, 'https://cafe.naver.com/example');

  assert.equal(articles.length, 1);
  assert.equal(articles[0].id, '200');
  assert.equal(articles[0].title, '새 글 제목');
});
