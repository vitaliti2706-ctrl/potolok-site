// /api/telegram-submit.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const { name = "", phone = "", message = "" } = body;

    // ВАЖНО: уберём возможные пробелы из токена
    const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const url = https://api.telegram.org/bot{token}/sendMessage;

    const payload = {
      chat_id: chatId,
      text: Заявка с сайта\nИмя: ${name}\n📞 Телефон: ${phone}\n💬 Сообщение: ${message},
    };

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await tgRes.text();      // читаем ОДИН раз
    let data;
    try { data = JSON.parse(raw); } catch { data = raw; }

    // Лог в Vercel (виден в Logs → Vercel Function)
    console.log("Ответ Telegram API:", data);

    if (!tgRes.ok || (data && data.ok === false)) {
      return res.status(500).json({ error: "Ошибка Telegram API", details: data });
    }

    return res.status(200).json({ ok: true, result: data });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}
