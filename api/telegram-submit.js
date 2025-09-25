// api/telegram-submit.js
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
      return;
    }

    const { name, phone, message = '', source = '' } = req.body || {};
    if (!name || !phone) {
      res.status(400).json({ ok: false, error: 'Missing name or phone' });
      return;
    }

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_TOKEN;
    const CHATID = process.env.TELEGRAM_CHAT_ID || process.env.CHAT_ID;
    if (!TOKEN || !CHATID) {
      res.status(500).json({ ok: false, error: 'Missing Telegram env vars' });
      return;
    }

    const text =
      Нова заявка з калькулятора\n +
      Ім’я: ${name}\n +
      Телефон: ${phone}\n +
      (message ? Коментар: ${message}\n : '') +
      (source ? Сторінка: ${source}\n : '');

    const tgResp = await fetch(https://api.telegram.org/bot${TOKEN}/sendMessage, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHATID, text })
    });

    if (!tgResp.ok) {
      const t = await tgResp.text();
      throw new Error(t);
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
};
