export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { name, phone, message } = req.body;

      // Здесь вместо console.log будет вызов Telegram API
      console.log("Новая заявка:", { name, phone, message });

      return res.status(200).json({ ok: true, received: { name, phone, message } });
    }

    // Проверка GET-запроса (для теста в браузере)
    return res.status(200).json({ ok: true, method: "GET" });
  } catch (err) {
    console.error("Ошибка сервера:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
