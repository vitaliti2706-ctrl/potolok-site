// /api/telegram-submit.js
export default async function handler(req, res) {
  // CORS (не завадить)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { name = '', phone = '', message = '' } = req.body || {};
    if (!name.trim() || !phone.trim()) {
      return res.status(400).json({ ok: false, error: 'Missing name or phone' });
    }

    // ⬇️ назва змінної як у Vercel
    const TOKEN  = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TOKEN || !CHAT_ID) {
      return res.status(500).json({ ok: false, error: 'Missing TELEGRAM_* env vars' });
    }

    const lines = [
      '<b>Нова заявка з калькулятора</b>',
      Ім'я: <b>${escapeHtml(name)}</b>,
      Телефон: <b>${escapeHtml(phone)}</b>,
      message ? escapeHtml(message) : null,
    ].filter(Boolean);

    const text = lines.join('\n');

    const tgResp = await fetch(https://api.telegram.org/bot${TOKEN}/sendMessage, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
    });

    if (!tgResp.ok) {
      const t = await tgResp.text().catch(() => '');
      return res.status(500).json({ ok: false, error: 'Telegram send failed', detail: t });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
