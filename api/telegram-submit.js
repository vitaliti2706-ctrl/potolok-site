.catch((e) => console.error("Ошибка запроса:", e));
// /api/telegram-submit.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Vercel может прислать body строкой — аккуратно распарсим
    const rawBody = req.body ?? {};
    const { name = "", phone = "", message = "" } =
      typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;

    console.log("ENV CHECK", {
      hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasChat: !!process.env.TELEGRAM_CHAT_ID,
    });

    const url = https://api.telegram.org/bot{process.env.TELEGRAM_BOT_TOKEN}/sendMessage;

    const payload = {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: Заявка с сайта\nИмя: ${name}\nТелефон: ${phone}\nСообщение: ${message},
    };

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Читаем ответ ОДИН раз и пробуем распарсить
    const raw = await tgRes.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { raw };
    }

    console.log("TELEGRAM RESPONSE", { status: tgRes.status, data });

    if (!tgRes.ok || (data && data.ok === false)) {
      return res
        .status(502)
        .json({ error: "Telegram error", status: tgRes.status, data });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error("HANDLER CRASH", err);
    return res.status(500).json({ error: "Handler crash", details: String(err) });
  }
}
