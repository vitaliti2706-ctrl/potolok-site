export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, message } = req.body;

    const url = https://api.telegram.org/bot{process.env.TELEGRAM_BOT_TOKEN}/sendMessage;
    const payload = {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: Заявка с сайта\nИмя: ${name}\nТелефон: ${phone}\nСообщение: ${message}
    };

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await tgRes.json();
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: String(err) });
  }
}
