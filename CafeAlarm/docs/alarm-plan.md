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
