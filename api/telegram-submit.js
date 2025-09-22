export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name = '', phone = '', message = '' } = req.body || {};

    // ВАЖНО: URL в кавычках и без лишних символов!
    const url = https://api.telegram.org/bot{process.env.TELEGRAM_BOT_TOKEN}/sendMessage;

    const payload = {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: Заявка с сайта\nИмя: ${name}\nТелефон: ${phone}\nСообщение: ${message}
    };

    const tgRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const txt = await tgRes.text();
    let data;
    try { data = JSON.parse(txt); } catch { data = { raw: txt }; }

    if (!tgRes.ok || (data && data.ok === false)) {
      return res.status(500).json({ error: 'Ошибка Telegram API', details: data });
    }

    return res.status(200).json({ ok: true, result: data });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: String(err) });
  }
}
