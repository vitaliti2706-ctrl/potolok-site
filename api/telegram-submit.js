// api/telegram-submit.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name = "", phone = "", message = "" } = req.body || {};

    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      return res.status(500).json({ error: "Server config error" });
    }

    const url = `https://api.telegram.org/bot{process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `📩 Заявка з сайту\nІм'я: ${name}\n📞 Телефон: ${phone}\n💬 Повідомлення: ${message}`,
      }),
    });

    const data = await tgRes.json();

    if (!data.ok) {
      return res.status(500).json({ error: "Помилка Telegram API", details: data });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}






