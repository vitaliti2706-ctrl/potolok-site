// /api/telegram-submit.js  (Vercel)
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const { name = '', phone = '', message = '' } = req.body || {};

    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({ ok: false, error: 'Missing env vars' });
    }

    const text =
📩 Нова заявка з сайту
👤 Ім'я: ${name || '—'}
📞 Телефон: ${phone || '—'}
📝 Повідомлення: ${message || '—'};

    const tgResp = await fetch(https://api.telegram.org/bot${token}/sendMessage, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    const data = await tgResp.json();
    if (!data.ok) {
      return res.status(500).json({ ok: false, error: data.description || 'Telegram error' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
