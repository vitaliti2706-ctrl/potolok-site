export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ ok: true, method: req.method });
    }

    // безопасный разбор body
    const payload =
      typeof req.body === "string" ? JSON.parse(req.body  "{}") : (req.body  {});

    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

    return res.status(200).json({
      ok: true,
      seen: {
        name: payload?.name ?? null,
        phone: payload?.phone ?? null,
        message: payload?.message ?? null,
      },
      env_present: {
        TELEGRAM_BOT_TOKEN: Boolean(TELEGRAM_BOT_TOKEN),
        TELEGRAM_CHAT_ID: Boolean(TELEGRAM_CHAT_ID),
      },
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
