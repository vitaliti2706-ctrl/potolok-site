// /api/test-env.js
export default async function handler(req, res) {
  res.status(200).json({
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? "✅ Есть" : "❌ Нет",
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID ? "✅ Есть" : "❌ Нет"
  });
}














