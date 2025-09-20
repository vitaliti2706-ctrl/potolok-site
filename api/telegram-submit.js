export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не поддерживается" });
  }

  const { name, phone, message } = req.body;

  const token = process.env.TELEGRAM_BOT_TOKEN; // твой токен бота
  const chatId = process.env.TELEGRAM_CHAT_ID; // твой чат ID
  const text = `📩 Новая заявка с сайта:
Имя: ${name}
Телефон: ${phone}
Сообщение: ${message}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    if (!response.ok) {
      throw new Error("Ошибка при отправке в Telegram");
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
