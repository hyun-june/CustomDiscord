export async function sendDiscordArticleAlert(webhookUrl, article) {
  const payload = {
    embeds: [
      {
        title: article.title,
        url: article.url,
        description: '네이버 카페에 새 글이 올라왔습니다.',
        color: 0x03c75a,
        timestamp: new Date().toISOString()
      }
    ]
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Discord webhook failed: ${response.status} ${response.statusText} ${body}`);
  }
}
