const url = `https://api.telegram.org/bot{process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

const bodyParams = new URLSearchParams({
  chat_id: process.env.TELEGRAM_CHAT_ID,
  text: `Заявка с сайта\nИмя: ${name}\n📞 Телефон: ${phone}\n💬 Сообщение: ${message}`
});

const telegramRes = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: bodyParams
});

const data = await telegramRes.json();









