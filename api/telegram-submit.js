export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, method: req.method });
  }

  try {
    // тело может прийти строкой или объектом
    const payload =
      typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    const name = String(payload.name || "");
    const phone = String(payload.phone || "");
    const message = String(payload.message || "");

    const { TELEGRAM_BOT_TOKEN: BOT_TOKEN, TELEGRAM_CHAT_ID: CHAT_ID } =
      process.env;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        ok: false,
        error: "Env vars missing",
        have: {
          TELEGRAM_BOT_TOKEN: !!BOT_TOKEN,
          TELEGRAM_CHAT_ID: !!CHAT_ID,
        },
      });
    }

    const text =
      Заявка с сайта\n +
      Имя: ${name}\n +
      Телефон: ${phone}\n +
      Сообщение: ${message};

    const tgRes = await fetch(
      https://api.telegram.org/bot${BOT_TOKEN}/sendMessage,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }
    );

    const data = await tgRes.json().catch(() => ({}));

    if (!tgRes.ok || data?.ok === false) {
      return res
        .status(500)
        .json({ ok: false, error: "Telegram API error", details: data });
    }

    return res.status(200).json({ ok: true, result: data?.result ?? null });
  } catch (e) {
    return res
      .status(500)
      .json({ ok: false, error: "Server error", details: String(e) });
  }
}
