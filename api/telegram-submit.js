// api/telegram-submit.js
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
      return;
    }

    const b = req.body || {};
    const name = b.name || '';
    const phone = b.phone || '';
    const message = b.message || '';
    const source = b.source || '';

    if (!name || !phone) {
      res.status(400).json({ ok: false, error: 'Missing name or phone' });
      return;
    }

    const TOKEN  = process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_TOKEN;
    const CHATID = process.env.TELEGRAM_CHAT_ID   || process.env.CHAT_ID;
    if (!TOKEN || !CHATID) {
      res.status(500).json({ ok: false, error: 'Missing Telegram env vars' });
      return;
    }

    const lines = [
      '✉️ Нова заявка з сайту',
      '👤 Імʼя: ' + name,
      '📞 Телефон: ' + phone,
      message ? '📝 Повідомлення: ' + message : null,
      source  ? '🌐 Сторінка: ' + source : null
    ].filter(Boolean);

    const text = lines.join('\n');

    const r = await fetch('https://api.telegram.org/bot' + TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHATID, text: text })
    });

    if (!r.ok) {
      const t = await r.text();
      throw new Error('Telegram error: ' + t);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: String(err) });
  }
};
