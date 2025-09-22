export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name = "", phone = "", message = "" } = await readBody(req);

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        error: "Env vars missing",
        have: { BOT_TOKEN: !!BOT_TOKEN, CHAT_ID: !!CHAT_ID }
      });
    }

    const text =
      Заявка с сайта\n +
      Имя: ${name}\n +
      Телефон: ${phone}\n +
      Сообщение: ${message};

    const tgRes = await fetch(
      https://api.telegram.org/bot{BOT_TOKEN}/sendMessage,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text })
      }
    );

    const data = await tgRes.json();

    if (!tgRes.ok || data?.ok === false) {
      return res.status(500).json({ error: "Telegram API error", details: data });
    }

    return res.status(200).json({ ok: true, result: data });
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: String(e) });
  }
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const ch of req) chunks.push(ch);
  const raw = Buffer.concat(chunks).toString("utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
