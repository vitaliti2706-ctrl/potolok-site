// api/telegram-submit.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // читаем raw-тело (без двойного чтения потока)
    const raw = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (ch) => (data += ch));
      req.on("end", () => resolve(data));
      req.on("error", reject);
    });

    let body = {};
    try { body = raw ? JSON.parse(raw) : {}; } catch { body = {}; }

    const name = body.name || "";
    const phone = body.phone || "";
    const message = body.message || "";

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

    // Диагностика окружения (без секретов)
    console.log("ENV CHECK:", {
      TELEGRAM_BOT_TOKEN: !!BOT_TOKEN,
      TELEGRAM_CHAT_ID: !!CHAT_ID,
    });

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        error: "Env vars missing",
        have: { TELEGRAM_BOT_TOKEN: !!BOT_TOKEN, TELEGRAM_CHAT_ID: !!CHAT_ID },
      });
    }

    const text =
      "Заявка с сайта\n" +
      Имя: ${name}\n +
      Телефон: ${phone}\n +
      Сообщение: ${message};

    let tgRes;
    try {
      tgRes = await fetch(https://api.telegram.org/bot{BOT_TOKEN}/sendMessage, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      });
    } catch (e) {
      console.error("FETCH THROW:", String(e));
      return res.status(500).json({ error: "fetch failed", details: String(e) });
    }

    const rawTxt = await tgRes.text();
    console.log("TG RAW:", rawTxt);

    let data;
    try { data = JSON.parse(rawTxt); } catch { data = { parse_error: true, raw: rawTxt }; }

    if (!tgRes.ok || (data && data.ok === false)) {
      console.error("TG ERROR:", data);
      return res.status(500).json({ error: "Telegram API error", details: data });
    }

    return res.status(200).json({ ok: true, result: data.result ?? data });
  } catch (e) {
    console.error("HANDLER CATCH:", String(e));
    return res.status(500).json({ error: "Server error", details: String(e) });
  }
}
