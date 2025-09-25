export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const b = req.body || {};
    const lines = [
      '📩 Нова заявка з сайту',
      "👤 Ім'я: " + (b.name || '-'),
      '📞 Телефон: ' + (b.phone || '-'),
      '📝 Повідомлення: ' + (b.message || '-'),
      '🌐 Сторінка: ' + (b.source || '-')
    ];
    const text = lines.join('\n');

    const r = await fetch(
      'https://api.telegram.org/bot' +
        process.env.TELEGRAM_BOT_TOKEN +
        '/sendMessage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: text
        })
      }
    );

    if (!r.ok) {
      const t = await r.text();
      throw new Error('Telegram error: ' + t);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: String(err) });
  }
}
