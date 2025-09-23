export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = {};
  try {
    if (typeof req.body === "string") {
      body = JSON.parse(req.body || "{}");
    } else {
      body = req.body || {};
    }
  } catch {
    body = {};
  }

  const name = body.name || "";
  const phone = body.phone || "";
  const message = body.message || "";

  const BOT_TOKEN = "ТВОЙ_ТОКЕН";   // вставь
  const CHAT_ID  = "ТВОЙ_CHAT_ID";  // вставь

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Env vars missing" });
  }

  const text =
    "Заявка с сайта\n" +
    "Имя: " + name + "\n" +
    "Телефон: " + phone + "\n" +
    "Сообщение: " + message;

  try {
    const tgRes = await fetch(
      https://api.telegram.org/bot${BOT_TOKEN}/sendMessage,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }
    );

    const data = await tgRes.json();

    if (!tgRes.ok || data.ok === false) {
      return res.status(500).json({ error: "Telegram API error", details: data });
    }

    return res.status(200).json({ ok: true, result: data.result });
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: String(e) });
  }
}
