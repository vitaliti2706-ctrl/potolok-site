export default async function handler(req, res) {
  // Разрешим только POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Надёжно читаем тело (на Vercel req.body может быть строкой)
  let body = {};
  try {
    if (typeof req.body === "string") {
      body = JSON.parse(req.body || "{}");
    } else if (typeof req.body === "object" && req.body !== null) {
      body = req.body;
    } else {
      body = {};
    }
  } catch {
    body = {};
  }

  const name = body.name || "";
  const phone = body.phone || "";
  const message = body.message || "";

  // >>> ВСТАВЬ СВОИ ДАННЫЕ ЗДЕСЬ <<<
  const BOT_TOKEN = "ВАШ_ТОКЕН_БОТА_ТЕЛЕГРАМ";   // например: 1234567890:AA...Z
  const CHAT_ID   = "ВАШ_CHAT_ID";                // например: 123456789 (ID чата/канала)

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "BOT_TOKEN or CHAT_ID is empty" });
  }

  // Текст сообщения (внимание на кавычки и плюсы — всё закрыто корректно)
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
