const { Telegraf, Markup } = require('telegraf');

// беремо токен з TELEGRAM_BOT_TOKEN, а якщо нема — з BOT_TOKEN
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply(
    'Натяжні стелі у Харкові — якісно, швидко та доступно 💪\n\n' +
    '✅ Вартість від 400 грн/м²\n' +
    '🎁 Знижка -10% до кінця тижня\n' +
    '🔧 Професійний монтаж, гарантія, безкоштовний виїзд\n\n' +
    'Оберіть дію нижче 👇',
    Markup.inlineKeyboard([
      [Markup.button.url('💰 Розрахувати вартість', 'https://potolok-kharkov.net.ua/calculator.html')],
      [Markup.button.url('📸 Переглянути приклади робіт', 'https://potolok-kharkov.net.ua/galereya.html')],
      [Markup.button.url('📋 Замовити замір', 'https://potolok-kharkov.net.ua/contacts.html')],
      [Markup.button.url('ℹ️ Про компанію', 'https://potolok-kharkov.net.ua/')],
      [Markup.button.callback('📞 Зв’язатись з майстром', 'contact')] // одна callback для телефону
    ])
  );
});

// /команди на випадок, якщо користувач пише їх руками
bot.command('calc',    (ctx) => ctx.reply('Калькулятор: https://potolok-kharkov.net.ua/calculator.html'));
bot.command('gallery', (ctx) => ctx.reply('Галерея: https://potolok-kharkov.net.ua/galereya.html'));
bot.command('order',   (ctx) => ctx.reply('Заявка на замір: https://potolok-kharkov.net.ua/contacts.html'));
bot.command('about',   (ctx) => ctx.reply('Сайт: https://potolok-kharkov.net.ua/'));

// єдина callback-дія — показати телефон/контакти прямо в чаті
bot.action('contact', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('📞 Телефон / Viber / Telegram: 097 454 67 13');
});

// Vercel serverless handler
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
