// /api/telegram-submit.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name = "", phone = "", message = "" } = req.body || {};

    const url = https://api.telegram.org/bot{process.env.TELEGRAM_BOT_TOKEN}/sendMessage;

    const payload = {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: Заявка с сайта\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n💬 Сообщение: ${message},
    };

    // Запрос к Telegram
    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // читаем ответ как текст
    const raw = await tgRes.text();
    let data;
    try {
      data = JSON.parse(raw); // если это JSON
    } catch (e) {
      data = { error: "Not JSON", raw }; // если пришёл текст
    }

    return res.status(200).json({ fromTelegram: data });
  } catch (err) {
    console.error("Ошибка на сервере:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
