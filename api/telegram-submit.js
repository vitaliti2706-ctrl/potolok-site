export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не поддерживается" });
  }

  const { name, phone, message } = req.body;

  const token = process.env.TELEGRAM_BOT_TOKEN; // Твой токен бота
  const chatId = process.env.TELEGRAM_CHAT_ID;  // Твой Chat ID
  const text = `📝 Новая заявка с сайта:
  
Имя: ${name}
Телефон: ${phone}
Сообщение: ${message}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка при отправке в Telegram");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

