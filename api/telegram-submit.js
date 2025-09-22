// /api/telegram-submit.js
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name = "", phone = "", message = "" } = req.body || {};

    const url = https://api.telegram.org/bot{process.env.TELEGRAM_BOT_TOKEN}/sendMessage;

    const payload = {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: Заявка с сайта\nИмя: ${name}\n📞 Телефон: ${phone}\n💬 Сообщение: ${message},
    };

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await tgRes.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = raw; }

    if (!tgRes.ok || (data && data.ok === false)) {
      console.error("Ответ Telegram API:", data);
      return res.status(500).json({ error: "Ошибка Telegram API", details: data });
    }

    return res.status(200).json({ ok: true, result: data });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}

// ✅ Экспорт через CommonJS
module.exports = handler;
