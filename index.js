const {
    Telegraf,
    Extra
} = require('telegraf')

const markup = Extra.markdown()

const Keyboard = require('telegraf-keyboard');
const commandos = require('./comandos');
const news = require('./news');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN)

// Configura opções do teclado
const optionsKeyboard = {
    inline: false, // default
    duplicates: false, // default
    newline: false, // default
};
const keyboard = new Keyboard(optionsKeyboard);

// Keyboard menu boas vindas
keyboard
    .add('Boas Vindas')
    .add('/acao {Cod ACAO}', '/Espresso19')
    .add('/cotacao USD', '/cotacao BTC')

// Boas vindas
bot.start((ctx) => {
    ctx.reply('Fala, Traders!!! 😉!\nSou a Botina! Vou facilitar sua vida como trader, para começa, escolha uma das opções abaixos.', keyboard.draw())
})

// Comandos
bot.command('/acao', async (ctx) => {
    commandos.retornaAcao(ctx.update.message.text.split(' ')[1], ctx);
})

bot.command('/cotacao', async (ctx) => {
    let d = ctx.update.message.text.split(' ');
    let r = await commandos.cotacaoMoeda(d[1]);
    ctx.reply(`A cotação atual de *${r.code}* é *${r.bid}*`, markup)
})

bot.command('/Espresso19', async (ctx) => {
    let r = await news.newsTC();
    console.log(r);
    await ctx.replyWithPhoto(r.img)
    await ctx.reply('*======== Espresso - 19h00 ========*', markup)
    await ctx.reply(`*${r.titulo}*`, markup)
    await ctx.reply(`${r.text.substring(0, 3500)}... Continue lendo em https://tc.tradersclub.com.br/tradersclub/channels/tc_news`)

    r.tickers.forEach(async element => {
        console.log(element);
        await ctx.reply(`*${element.name}* - ${element.value} (${element.variation}%)`, markup)

    });
})

bot.launch()