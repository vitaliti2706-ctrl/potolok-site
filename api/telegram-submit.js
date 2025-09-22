// /api/telegram-submit.js — CommonJS-версия без ESM
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name = '', phone = '', message = '' } = req.body || {};

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error('ENV_MISSING', { hasToken: !!token, hasChat: !!chatId });
      return res.status(500).json({ error: 'Missing env vars' });
    }

    const url = https://api.telegram.org/bot{token}/sendMessage;
    const payload = {
      chat_id: chatId,
      text: Заявка с сайта\nИмя: ${name}\nТелефон: ${phone}\nСообщение: ${message},
    };

    const tgRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const bodyText = await tgRes.text(); // читаем как текст, чтобы всегда увидеть, что пришло
    console.log('TG_STATUS', tgRes.status, bodyText);

    if (!tgRes.ok) {
      return res.status(500).json({
        error: 'Telegram API',
        status: tgRes.status,
        body: bodyText,
      });
    }

    return res.status(200).json({ ok: true, body: bodyText });
  } catch (err) {
    console.error('SERVER_CRASH', err?.stack || String(err));
    return res.status(500).json({ error: 'Server crash', message: String(err) });
  }
};
