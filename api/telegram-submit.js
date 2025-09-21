// api/telegram-submit.js

export default async function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Достаём поля из тела запроса
  const { name, phone, message } = req.body || {};

  try {
    // Отправка сообщения в Telegram
    const telegramRes = await fetch(
      `https://api.telegram.org/bot{process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: `Заявка с сайта\nИмя: ${name}\n📞 Телефон: ${phone}\n💬 Сообщение: ${message}`,
        }),
      }
    );

    const data = await telegramRes.json();

    // Лог в Vercel → Logs (чтобы увидеть точный ответ Telegram)
    console.log("Ответ Telegram API:", data);

    if (!data.ok) {
      return res.status(500).json({ error: "Ошибка Telegram API", details: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Ошибка при отправке:", err);
    return res.status(500).json({ error: "Internal Server Error", details: String(err) });
  }
}








