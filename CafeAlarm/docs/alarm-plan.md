# Cafe Alarm Development Notes

## Current Goal

Build a small Node.js app that watches a Naver Cafe board and sends a Discord webhook alert when a new article appears.

This project is intentionally being rebuilt step by step for learning. The older MVP exists in the sibling folder:

```txt
C:\Users\gwj61\Desktop\dev\CustomDiscord\alarmForDiscord
```

The current working project is:

```txt
C:\Users\gwj61\Desktop\dev\CustomDiscord\CafeAlarm
```

## Current State

`npm start` currently runs `src/index.js`.

The current flow is:

```txt
index.js
  -> getCafeData()
  -> sendDiscordWebhook()
```

`src/naverCafe.js` successfully fetches Naver Cafe article data and writes it to:

```txt
data/cafeData.json
```

`src/discordWebhook.js` is being tested separately with Discord webhook payloads.

## Important Discord Webhook Notes

Discord webhook JSON should use `content` for a plain text message:

```js
{
  content: "test"
}
```

For card-style messages, use `embeds`, not `embed`:

```js
{
  embeds: [
    {
      title: article.title,
      url: article.url,
      description: "네이버 카페에 새 글이 올라왔습니다.",
      color: 0x03c75a,
      timestamp: new Date().toISOString()
    }
  ]
}
```

The webhook URL was pasted in chat during testing, so it should be deleted or regenerated in Discord and moved into `.env` later.

## Where To Put Comparison Logic

Keep responsibilities separated:

```txt
src/naverCafe.js       = fetch and normalize Naver Cafe articles
src/discordWebhook.js  = send Discord webhook messages
src/index.js           = orchestrate the app flow
```

So the comparison logic should live in `src/index.js`, because it decides the app flow:

```txt
1. Read previous saved data
2. Fetch latest cafe data
3. Compare old vs latest data
4. Send Discord alert for new articles
5. Save latest data
```

## Simplest Comparison Strategy

For the learning MVP, use the simplest possible comparison:

Store only the latest article ID.

Example state:

```json
{
  "lastArticleId": 123
}
```

Flow:

```txt
1. Fetch latest articles
2. Pick articles[0] as the newest article
3. Read saved lastArticleId
4. If there is no saved ID, save current newest ID and do not alert
5. If newest articleId is different, send Discord alert
6. Save newest articleId
7. If it is the same, print "새 글이 없습니다."
```

This is easy to understand, but it only catches the newest article if multiple articles arrive between runs.

Later, upgrade to storing a list or Set of seen article IDs.

## Recommended Next Steps

1. Change `getCafeData()` so it returns the article array instead of only writing the file.
2. In `src/index.js`, read the previous `lastArticleId` from `data/cafeData.json`.
3. Compare `articles[0].articleId` with `lastArticleId`.
4. If it is the first run, save only the latest ID and skip Discord.
5. If it changed, send a Discord alert for the latest article.
6. Save the new latest ID.
7. After one-run behavior works, add a loop or interval.
8. Move webhook URL and cafe URL into `.env`.

## Useful Debugging Pattern

When Discord does not send, always log the response:

```js
console.log("status:", response.status);
console.log("ok:", response.ok);

const text = await response.text();
console.log("body:", text);
```

Successful Discord webhook sends often return:

```txt
status: 204
body:
```

An empty body with status `204` is normal.

---

# 카페 알림 개발 메모 한국어판

## 현재 목표

네이버 카페 게시판을 확인하다가 새 글이 올라오면 Discord 웹훅으로 알림을 보내는 작은 Node.js 앱을 만든다.

이 프로젝트는 학습을 위해 처음부터 단계별로 다시 만들어보는 중이다. 이전에 만든 MVP는 상위 폴더의 형제 프로젝트에 있다.

```txt
C:\Users\gwj61\Desktop\dev\CustomDiscord\alarmForDiscord
```

현재 직접 개선하면서 작업 중인 프로젝트는 이 폴더다.

```txt
C:\Users\gwj61\Desktop\dev\CustomDiscord\CafeAlarm
```

## 현재 상태

`npm start`를 실행하면 현재는 `src/index.js`가 실행된다.

현재 흐름은 대략 이렇다.

```txt
index.js
  -> getCafeData()
  -> sendDiscordWebhook()
```

`src/naverCafe.js`는 네이버 카페 게시글 데이터를 가져와서 아래 파일에 저장하는 데 성공한 상태다.

```txt
data/cafeData.json
```

`src/discordWebhook.js`에서는 Discord 웹훅 payload를 따로 테스트하고 있다.

## Discord 웹훅에서 중요한 점

일반 텍스트 메시지를 보낼 때는 `content`를 쓴다.

```js
{
  content: "test"
}
```

Discord 카드 형태로 보내고 싶으면 `embed`가 아니라 `embeds`를 써야 한다. 복수형이다.

```js
{
  embeds: [
    {
      title: article.title,
      url: article.url,
      description: "네이버 카페에 새 글이 올라왔습니다.",
      color: 0x03c75a,
      timestamp: new Date().toISOString()
    }
  ]
}
```

테스트 중 웹훅 URL을 채팅에 그대로 붙여넣었기 때문에, Discord에서 해당 웹훅은 삭제하거나 새로 발급하는 것이 좋다. 나중에는 웹훅 URL을 코드에 직접 쓰지 말고 `.env` 파일로 옮긴다.

## 비교 로직을 어디에 둘지

파일별 책임은 이렇게 나누는 것이 좋다.

```txt
src/naverCafe.js       = 네이버 카페 글을 가져오고 필요한 형태로 정리
src/discordWebhook.js  = Discord 웹훅 메시지 전송
src/index.js           = 전체 앱 흐름 조립
```

그래서 새 글인지 비교하는 로직은 `src/index.js`에 두는 것이 자연스럽다.

`index.js`가 맡을 흐름은 이렇다.

```txt
1. 이전에 저장한 데이터 읽기
2. 네이버 카페에서 최신 데이터 가져오기
3. 이전 데이터와 최신 데이터 비교하기
4. 새 글이면 Discord 알림 보내기
5. 최신 데이터를 다시 저장하기
```

## 가장 간단한 비교 방식

학습용 MVP에서는 가장 단순한 방식으로 시작한다.

전체 글 목록을 전부 비교하지 말고, 가장 최신 글의 `articleId` 하나만 저장한다.

예시 저장 형태:

```json
{
  "lastArticleId": 123
}
```

흐름:

```txt
1. 최신 글 목록 가져오기
2. articles[0]을 가장 최신 글로 본다
3. 저장된 lastArticleId를 읽는다
4. 저장된 ID가 없으면 첫 실행이므로 현재 최신 ID만 저장하고 알림은 보내지 않는다
5. 최신 articleId가 저장된 lastArticleId와 다르면 새 글로 판단한다
6. 새 글이면 Discord 알림을 보낸다
7. 최신 articleId를 저장한다
8. 같으면 "새 글이 없습니다."를 출력한다
```

이 방식은 이해하기 쉽다. 단점은 실행 사이에 새 글이 여러 개 올라오면 가장 최신 글 하나만 감지한다는 점이다.

나중에 안정화되면 `articleId` 목록이나 `Set`을 저장해서 여러 새 글을 모두 감지하는 방식으로 업그레이드하면 된다.

## 추천 다음 단계

1. `getCafeData()`가 파일에 저장만 하지 말고 article 배열을 `return`하도록 바꾼다.
2. `src/index.js`에서 `data/cafeData.json`에 저장된 이전 `lastArticleId`를 읽는다.
3. `articles[0].articleId`와 `lastArticleId`를 비교한다.
4. 첫 실행이면 최신 ID만 저장하고 Discord 알림은 보내지 않는다.
5. ID가 바뀌었으면 최신 글에 대해 Discord 알림을 보낸다.
6. 새 최신 ID를 저장한다.
7. 한 번 실행하는 흐름이 잘 되면 그 다음에 반복 실행을 추가한다.
8. 웹훅 URL과 카페 URL은 `.env`로 옮긴다.

## 디버깅할 때 유용한 패턴

Discord 메시지가 안 보내질 때는 항상 응답을 출력해본다.

```js
console.log("status:", response.status);
console.log("ok:", response.ok);

const text = await response.text();
console.log("body:", text);
```

Discord 웹훅 전송이 성공하면 보통 이렇게 나온다.

```txt
status: 204
body:
```

`status`가 `204`이고 `body`가 비어 있으면 정상이다.
