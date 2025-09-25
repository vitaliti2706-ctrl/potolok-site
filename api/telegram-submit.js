// Папка: /api
// Файл: telegram-submit.js
// CommonJS-варіант без "export", щоб не було помилки "Unexpected token 'export'"

const send = (res, code, payload) => {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

module.exports = async (req, res) => {
  try {
    // лише POST
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return send(res, 405, { ok: false, error: 'Method Not Allowed' });
    }

    // іноді Vercel уже парсить body, іноді ні — підтримуємо обидва варіанти
    const raw = req.body ?? (await new Promise((resolve) => {
      let data = '';
      req.on('data', (c) => (data += c));
      req.on('end', () => resolve(data));
    }));
    const b = typeof raw === 'string' && raw.length ? JSON.parse(raw) : raw || {};

    const name    = (b.name || '').toString().trim();
    const phone   = (b.phone || '').toString().trim();
    const message = (b.message || '').toString();
    const source  = (b.source || '').toString();

    if (!name || !phone) {
      return send(res, 400, { ok: false, error: 'Missing name or phone' });
    }

    const TOKEN  = process.env.TELEGRAM_BOT_TOKEN;
    const CHATID = process.env.TELEGRAM_CHAT_ID;
    if (!TOKEN || !CHATID) {
      return send(res, 500, { ok: false, error: 'Bot credentials are not set' });
    }

    const text = [
      '✉️ Нова заявка з сайту',
      👤 Імʼя: ${name},
      📞 Телефон: ${phone},
      📝 Повідомлення: ${message || '-'},
      🌐 Сторінка: ${source || '-'}
    ].join('\n');

    const tg = await fetch(https://api.telegram.org/bot${TOKEN}/sendMessage, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHATID, text })
    });

    const bodyText = await tg.text();
    if (!tg.ok) return send(res, 502, { ok: false, error: bodyText });

    return send(res, 200, { ok: true });
  } catch (err) {
    return send(res, 500, { ok: false, error: String(err) });
  }
};
