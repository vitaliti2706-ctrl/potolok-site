// api/telegram-submit.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, message } = req.body;

  try {
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: `📩 Заявка з сайту\n👤 Ім'я: ${name}\n📞 Телефон: ${phone}\n💬 Повідомлення: ${message}`,
        }),
      }
    );

    const data = await telegramRes.json();

    if (!data.ok) {
      return res.status(500).json({ error: "Помилка Telegram API", details: data });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Помилка сервера:", err);
    res.status(500).json({ error: "Server error" });
  }
}




