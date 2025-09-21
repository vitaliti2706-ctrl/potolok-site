// /api/telegram-submit.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let name = "", phone = "", message = "";
    const ct = (req.headers["content-type"] || "").toLowerCase();

    if (ct.includes("application/json")) {
      ({ name = "", phone = "", message = "" } = req.body || {});
    } else {
      // читаем «сырой» тело запроса (для form-urlencoded и т.п.)
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString();

      if (ct.includes("application/x-www-form-urlencoded")) {
        const p = new URLSearchParams(raw);
        name = p.get("name") || p.get("имя") || "";
        phone = p.get("phone") || p.get("телефон") || "";
        message = p.get("message") || p.get("сообщение") || "";
      } else {
        // попытка разобрать как JSON на всякий случай
        try { ({ name = "", phone = "", message = "" } = JSON.parse(raw)); } catch {}
      }
    }

    name = String(name).trim() || "—";
    phone = String(phone).trim() || "—";
    message = String(message).trim() || "—";

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return res.status(500).json({ error: "Missing TELEGRAM_* env vars" });
    }

    const text =
      `🆕 Новая заявка с сайта\n` +
      `👤 Имя: ${name}\n` +
      `📞 Телефон: ${phone}\n` +
      `✉️ Сообщение: ${message}`;

    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    const data = await tg.json();
    if (!tg.ok) throw new Error(data?.description || "Telegram error");

    return res.status(200).json({ ok: true, result: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}


