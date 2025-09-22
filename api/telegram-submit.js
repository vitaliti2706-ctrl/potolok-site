// api/telegram-submit.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // На Vercel req.body может быть строкой или объектом
    let body = {};
    if (typeof req.body === "string") {
      try {
        body = JSON.parse(req.body || "{}");
      } catch {
        body = {};
      }
    } else if (typeof req.body === "object" && req.body) {
      body = req.body;
    }

    const name = body.name || "";
    const phone = body.phone || "";
    const message = body.message || "";

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        error: "Env vars missing",
        have: {
          TELEGRAM_BOT_TOKEN: !!BOT_TOKEN,
          TELEGRAM_CHAT_ID: !!CHAT_ID,
        },
      });
    }

    const text =
      "Заявка с сайта\n" +
      "Имя: " + name + "\n" +
      "Телефон: " + phone + "\n" +
      "Сообщение: " + message;

    const tgRes = await fetch(
      https://api.telegram.org/bot${BOT_TOKEN}/sendMessage,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }
    );

    const data = await tgRes.json();
    if (!tgRes.ok || data?.ok === false) {
      return res
        .status(500)
        .json({ error: "Telegram API error", details: data });
    }

    return res.status(200).json({ ok: true, result: data.result });
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: String(e) });
  }
}
