// api/telegram-submit.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, message } = req.body;

  try {
    const telegramRes = await fetch(
      `https://api.telegram.org/bot{process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: `Заявка с сайта\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n💬 Сообщение: ${message}`
        }),
      }
    );

    const data = await telegramRes.json();

    if (!data.ok) {
      return res.status(500).json({ error: "Ошибка Telegram API", details: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: "Ошибка сервера", details: err.message });
  }
}







