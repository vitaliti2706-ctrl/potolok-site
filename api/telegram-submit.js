export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { name, phone, message } = req.body || {};

    // простая валидация
    if (!phone) {
      return res.status(400).json({ ok: false, error: "Phone is required" });
    }

    const text = 📩 Нова заявка з сайту
👤 Ім'я: ${name || "-"}
📞 Телефон: ${phone}
✏️ Повідомлення: ${message || "-"}
🌐 Сторінка: ${req.headers.referer || "невідомо"};

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({ ok: false, error: "Missing Telegram env vars" });
    }

    const url = https://api.telegram.org/bot${token}/sendMessage;

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        // можно убрать parse_mode, т.к. у нас обычный текст
        // parse_mode: "HTML",
      }),
    });

    const data = await tgRes.json();

    if (!data.ok) {
      return res.status(500).json({ ok: false, error: data.description || "Telegram API error" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Telegram error:", err);
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
}
