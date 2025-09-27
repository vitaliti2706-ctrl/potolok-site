export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const { name = "", phone = "", message = "" } = req.body || {};

    const text = 📩 Нова заявка з сайту
👤 Ім'я: ${name}
📞 Телефон: ${phone}
✏️ Повідомлення: ${message}
🌐 Сторінка: ${req.headers.referer || "невідомо"};

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      res.status(500).json({ ok: false, error: "Missing TELEGRAM_* env vars" });
      return;
    }

    const tgResp = await fetch(https://api.telegram.org/bot${token}/sendMessage, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    const data = await tgResp.json();

    if (!tgResp.ok || !data.ok) {
      res
        .status(500)
        .json({ ok: false, error: data?.description || Telegram HTTP ${tgResp.status} });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Telegram error:", err);
    res.status(500).json({ ok: false, error: String(err) });
  }
}
``
