export const sendDiscordWebhook = async (discordWebhookUrl, article) => {
  const payload = {
    embeds: [
      {
        title: article.subject,
        url: article.url,
        description: article.summary,
        color: 0x03c75a,
        timestamp: new Date(article.writeDateTimestamp).toISOString(),
      },
    ],
  };

  const response = await fetch(discordWebhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Discord webhook failed: ${response.status} ${text}`);
  }
};
