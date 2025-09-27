export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const esc = (v) => String(v ?? '').replace(/[<>]/g, '');

  try {
    const { name = '', phone = '', message = '' } = req.body || {};

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({ ok: false, error: 'Missing env: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID' });
    }

    const text =
      📩 Нова заявка з сайту\n +
      👤 Ім'я: ${esc(name)}\n +
      📞 Телефон: ${esc(phone)}\n +
      📝 Повідомлення: ${esc(message)}\n +
      🌐 Сторінка: ${esc(req.headers.referer || '')};

    const tgUrl = https://api.telegram.org/bot${token}/sendMessage;

    const tgResp = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true
      })
    });

    const data = await tgResp.json();

    if (!data.ok) {
      return res.status(500).json({ ok: false, error: data.description || 'Telegram error' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
