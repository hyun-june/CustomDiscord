const webhookUrl =
  "https://discord.com/api/webhooks/1499411607070048480/1Xe36C-BUchN_oaOlrSTjxIdAVCVUb7LEwVoPsXmfdMOuj-3hK_-2CwDM03xx5ybn4yk";

const article = {
  title: "테스트 제목",
  url: "https://www.naver.com",
  description: "내용",
  color: 0x03c75a,
  timestamp: new Date().toISOString(),
};

export const sendDiscordWebhook = async () => {
  const payload = {
    embeds: [
      {
        title: article.title,
        url: article.url,
        description: article.description,
        color: 0x03c75a,
        timestamp: new Date().toISOString(),
      },
    ],
  };
  const response = await fetch(webhookUrl, {
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
