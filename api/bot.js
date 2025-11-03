const { Telegraf, Markup } = require('telegraf');

// Беремо токен із Vercel Environment Variables
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN);

// Тестовий лог, щоб переконатись, що токен підхопився
console.log("✅ BOT TOKEN:", process.env.TELEGRAM_BOT_TOKEN ? "Found" : "Missing");

bot.start(async (ctx) => {
  await ctx.reply(
    'Натяжні стелі у Харкові — якісно, швидко та доступно 💪\n\n' +
    '✅ Вартість від 400 грн/м²\n' +
    '🎁 Знижка -10% до кінця тижня\n' +
    '💡 Професійний монтаж, гарантія, безкоштовний виїзд\n\n' +
    'Оберіть дію нижче 👇',
    Markup.inlineKeyboard([
      [Markup.button.url('💰 Розрахувати вартість', 'https://potolok-kharkov.net.ua/calculator.html')],
      [Markup.button.url('📸 Переглянути роботи', 'https://potolok-kharkov.net.ua/galereya.html')],
      [Markup.button.url('📋 Замовити замір', 'https://potolok-kharkov.net.ua/contacts.html')],
      [Markup.button.url('ℹ️ Про компанію', 'https://potolok-kharkov.net.ua')],
      [Markup.button.callback('📞 Зв’язатись з майстром', 'contact')]
    ])
  );
});

bot.action('contact', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('📞 Телефон / Viber / Telegram: 097 454 67 13');
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      return res.status(200).send('OK');
    } catch (e) {
      console.error(e);
      return res.status(500).send('Error');
    }
  }
  return res.status(200).send('Bot webhook is live.');
};
