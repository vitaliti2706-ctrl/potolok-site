export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, message } = req.body;

    // Проверим что данные пришли
    if (!name  !phone  !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Здесь будет логика отправки в Telegram
    console.log("Отправка сообщения:", name, phone, message);

    return res.status(200).json({ ok: true, msg: 'Заявка отправлена' });
  } catch (err) {
    console.error("Ошибка в API:", err);
    return res.status(500).json({ error: 'Server error' });
  }
}
