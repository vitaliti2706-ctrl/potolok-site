// /api/telegram-submit.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const { name = "", phone = "", message = "" } = body;

  try {
    // ВАЖНО: обратные кавычки! и /bot (без s)
    const url = `https://api.telegram.org/bot{process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    const payload = {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: `Заявка с сайта\nИмя: ${name}\n📞 Телефон: ${phone}\n💬 Сообщение: ${message}`,
    };

    const telegramRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await telegramRes.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = raw; }

    // В логах Vercel увидим точный ответ Telegram
    console.log("Ответ Telegram API:", data);

    if (!telegramRes.ok || (data && data.ok === false)) {
      return res.status(500).json({ error: "Ошибка Telegram API", details: data });
    }

    return res.status(200).json({ ok: true, result: data });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}













