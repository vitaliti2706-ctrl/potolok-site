export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { name = "", phone = "", message = "" } = req.body || {};

    const text = `📩 Нова заявка з сайту
👤 Ім'я: ${name}
📞 Телефон: ${phone}
✏️ Повідомлення: ${message}
🌐 Сторінка: ${req.headers.referer || "невідомо"}`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    console.log("ENV check", { hasToken: !!token, hasChat: !!chatId });

    if (!token || !chatId) {
      return res.status(500).json({ ok: false, error: "Missing TELEGRAM_* env vars" });
    }

    const tgResp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });

    const raw = await tgResp.text();
    console.log("TG raw:", raw);

    let data;
    try { data = JSON.parse(raw); }
    catch { 
      return res.status(500).json({ ok: false, error: "TG non-JSON", raw, http: tgResp.status }); 
    }

    if (!tgResp.ok || !data.ok) {
      return res.status(500).json({ 
        ok: false, 
        error: data?.description || `Telegram HTTP ${tgResp.status}`, 
        data 
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Telegram error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
