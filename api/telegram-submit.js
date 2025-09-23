// pages/api/telegram-submit.js
export default async function handler(req, res) {
  // Для простого GET покажем, что функция жива
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, method: req.method });
  }

  try {
    // --- Безопасно читаем тело запроса (и строку, и объект) ---
    let body = {};
    if (req.headers["content-type"]?.includes("application/json")) {
      body = typeof req.body === "string" ? JSON.parse(req.body  "{}") : (req.body  {});
    } else {
      // На всякий случай — ручное чтение тела
      const raw = await new Promise((resolve) => {
        let acc = "";
        req.on("data", (ch) => (acc += ch));
        req.on("end", () => resolve(acc));
      });
      try { body = JSON.parse(raw || "{}"); } catch { body = {}; }
    }

    const { name = "", phone = "", message = "" } = body;

    // --- Переменные окружения ---
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        ok: false,
        error: "ENV_MISSING",
        have: {
          TELEGRAM_BOT_TOKEN: !!BOT_TOKEN,
          TELEGRAM_CHAT_ID: !!CHAT_ID,
        },
      });
    }

    // --- Текст сообщения ---
    const text =
      Заявка с сайта\n +
      Имя: ${name}\n +
      Телефон: ${phone}\n +
      Сообщение: ${message};

    // --- Отправка в Telegram ---
    const tgRes = await fetch(
      https://api.telegram.org/bot${BOT_TOKEN}/sendMessage,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }
    );

    // Пытаемся разобрать JSON (если там HTML ошибки — не упадём)
    let data = {};
    try { data = await tgRes.json(); } catch { data = {}; }

    if (!tgRes.ok || data?.ok === false) {
      return res.status(502).json({
        ok: false,
        error: "TELEGRAM_FAIL",
        status: tgRes.status,
        details: data,
      });
    }

    return res.status(200).json({ ok: true, result: data.result || null });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: "SERVER_CRASH",
      details: String(e),
    });
  }
}
