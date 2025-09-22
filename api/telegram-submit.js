// /api/telegram-submit.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Тело запроса (на всякий случай парсим и строку, и объект)
  let body = {};
  try {
    if (req.body && typeof req.body === "object") {
      body = req.body;
    } else if (typeof req.body === "string") {
      body = JSON.parse(req.body || "{}");
    }
  } catch {
    body = {};
  }

  const { name = "", phone = "", message = "" } = body;

  // Проверим, подтянулись ли переменные окружения с Vercel
  console.log(
    "ENV TELEGRAM_BOT_TOKEN:",
    process.env.TELEGRAM_BOT_TOKEN ? "[set]" : "undefined"
  );
  console.log(
    "ENV TELEGRAM_CHAT_ID:",
    process.env.TELEGRAM_CHAT_ID || "undefined"
  );

  // ВАЖНО: обратные кавычки и bot (без s)
  const url = https://api.telegram.org/bot{process.env.TELEGRAM_BOT_TOKEN}/sendMessage;

  const payload = {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: Заявка с сайта\nИмя: ${name}\n📞 Телефон: ${phone}\n💬 Сообщение: ${message},
  };

  try {
    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await tgRes.text();
    console.log("Raw Telegram response:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { parse_error: true, raw };
    }

    if (!tgRes.ok || data?.ok === false) {
      return res.status(500).json({ error: "Ошибка Telegram API", details: data });
    }

    return res.status(200).json({ ok: true, result: data });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}














