// api/telegram-submit.js
export default async function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Безопасно читаем тело: на Vercel req.body может быть строкой или объектом
    let body = {};
    try {
      if (typeof req.body === "string") {
        body = JSON.parse(req.body || "{}");
      } else if (req.body && typeof req.body === "object") {
        body = req.body;
      } else {
        // запасной вариант: ручное чтение потока
        const raw = await new Promise((resolve, reject) => {
          let data = "";
          req.on("data", (ch) => (data += ch));
          req.on("end", () => resolve(data));
          req.on("error", reject);
        });
        body = raw ? JSON.parse(raw) : {};
      }
    } catch {
      body = {};
    }

    const name = body.name || "";
    const phone = body.phone || "";
    const message = body.message || "";

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

    // Проверяем переменные окружения
    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        error: "Env vars missing",
        have: {
          TELEGRAM_BOT_TOKEN: !!BOT_TOKEN,
          TELEGRAM_CHAT_ID: !!CHAT_ID,
        },
      });
    }

    // Текст сообщения для Telegram
    const text =
      "Заявка с сайта\n" +
      "Имя: " + name + "\n" +
      "Телефон: " + phone + "\n" +
      "Сообщение: " + message;

    // Отправка в Telegram
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
      return res.status(500).json({
        error: "Telegram API error",
        details: data,
      });
    }

    // Успех
    return res.status(200).json({ ok: true, result: data.result });
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: String(e) });
  }
}
