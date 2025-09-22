// /api/telegram-submit.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Забираем данные из тела запроса (на случай пустого тела — дефолты)
  const body = req.body || {};
  const { name = "", phone = "", message = "" } = body;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      error: "ENV_MISSING",
      hasToken: !!token,
      hasChatId: !!chatId,
    });
  }

  // ВАЖНО: только /bot (без s)
  const url = https://api.telegram.org/bot{token}/sendMessage;

  const text =
    Заявка с сайта\n +
    Имя: ${name}\n +
    Телефон: ${phone}\n +
    Сообщение: ${message};

  const payload = {
    chat_id: chatId,
    text,
  };

  try {
    // ЛОГИ ДЛЯ ОТЛАДКИ — увидим их в Vercel → Deployments → Logs
    console.log("URL:", url);
    console.log("PAYLOAD:", payload);

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await tgRes.text(); // читаем один раз
    console.log("TG_STATUS:", tgRes.status, tgRes.statusText);
    console.log("TG_RAW:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { raw };
    }

    if (!tgRes.ok || (data && data.ok === false)) {
      return res.status(500).json({
        error: "TELEGRAM_API",
        status: tgRes.status,
        details: data,
      });
    }

    return res.status(200).json({ ok: true, result: data });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "SERVER", message: String(err) });
  }
}
