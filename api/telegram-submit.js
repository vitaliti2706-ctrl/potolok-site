// api/telegram-submit.js
export default async function handler(req, res) {
  try {
    // простой пинг
    if (req.method === "GET") {
      // разберём query-параметры
      const url = new URL(req.url, http://${req.headers.host});
      const diag = url.searchParams.get("diag");

      // /api/telegram-submit?diag=1 — полный диагноз
      if (diag === "1") {
        const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

        // Проверим сам токен через getMe (без chat_id)
        let getMe = null, getMeErr = null;
        if (TELEGRAM_BOT_TOKEN) {
          try {
            const r = await fetch(https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe);
            const t = await r.text();
            try { getMe = JSON.parse(t); } catch { getMeErr = { raw: t }; }
          } catch (e) { getMeErr = String(e); }
        }

        return res.status(200).json({
          ok: true,
          method: "GET",
          node: process.version,
          env_present: {
            TELEGRAM_BOT_TOKEN: Boolean(TELEGRAM_BOT_TOKEN),
            TELEGRAM_CHAT_ID: Boolean(TELEGRAM_CHAT_ID),
          },
          getMe, getMeErr,
        });
      }

      return res.status(200).json({ ok: true, method: "GET" });
    }

    // обычный POST — просто эхо, чтобы не падало
    if (req.method === "POST") {
      let body = {};
      if (typeof req.body === "string") {
        try { body = JSON.parse(req.body || "{}"); } catch { body = {}; }
      } else if (req.body && typeof req.body === "object") {
        body = req.body;
      }
      return res.status(200).json({ ok: true, seen: body });
    }

    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
