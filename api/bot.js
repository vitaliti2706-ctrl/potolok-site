const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply(
    'Натяжні стелі у Харкові — якісно, швидко та доступно 💪\n\n' +
    '✅ Вартість від 400 грн/м²\n' +
    '💡 Парящі стелі з LED-підсвіткою — від 700 грн/м² (залежно від потужності та якості стрічки й блоку живлення)\n' +
    '🎁 Знижка -10% до кінця тижня\n' +
    '🔧 Професійний монтаж, гарантія, безкоштовний виїзд\n\n' +
    'Оберіть дію нижче 👇',
    Markup.inlineKeyboard([
      [Markup.button.callback('💰 Розрахувати вартість', 'calc')],
      [Markup.button.callback('📸 Переглянути приклади робіт', 'gallery')],
      [Markup.button.callback('📞 Зв’язатись з майстром', 'contact')],
      [Markup.button.callback('📋 Замовити замір', 'order')],
      [Markup.button.callback('🎁 Перевірити знижки', 'discount')],
      [Markup.button.callback('ℹ️ Про компанію', 'about')],
    ])
  );
});

bot.action('calc', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('💰 Щоб розрахувати вартість, перейдіть на калькулятор:\nhttps://potolok-kharkov.net.ua/calculator.html');
});

bot.action('gallery', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('📸 Перегляньте приклади наших робіт:\nhttps://potolok-kharkov.net.ua/galereya.html');
});

bot.action('contact', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('📞 Зв’язатись із майстром:\nТелефон / Viber / Telegram: 097 454 67 13');
});

bot.action('order', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('📋 Залиште заявку на замір тут:\nhttps://potolok-kharkov.net.ua/contacts.html');
});

bot.action('discount', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('🎁 Поточна знижка -10% до кінця тижня!\nНе втратьте можливість заощадити 😉');
});

bot.action('about', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    'ℹ️ *Potolok.kh* — професійний монтаж натяжних стель у Харкові та області.\n' +
    'Класичні, тіньові, парящі, трек-системи та LED підсвітка.\n' +
    'Гарантія, швидкі терміни, безкоштовний виїзд!',
    { parse_mode: 'Markdown' }
  );
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
