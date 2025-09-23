export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { name, phone, message } = req.body;

      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

      if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ ok: false, error: "Missing Telegram credentials" });
      }

      const text =
        📩 Нова заявка з сайту\n +
        👤 Ім'я: ${name}\n +
        📞 Телефон: ${phone}\n +
        💬 Повідомлення: ${message};

      const tgRes = await fetch(https://api.telegram.org/bot${BOT_TOKEN}/sendMessage, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      });

      const data = await tgRes.json();
      return res.status(200).json({ ok: true, telegram: data });
    }

    return res.status(200).json({ ok: true, method: "GET" });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
