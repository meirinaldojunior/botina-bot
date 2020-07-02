const {
    Telegraf,
    Extra
} = require('telegraf')

const markup = Extra.markdown()
var schedule = require('node-schedule');
const Keyboard = require('telegraf-keyboard');
const commandos = require('./comandos');
const rfsIds = require("./refIds");
const news = require('./news');
require('dotenv').config();

const headerTC = '';

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
    .add('/acao Cod_Acao', '/espresso')
    .add('/cotacao USD', '/cotacao BTC')

// Boas vindas
bot.start((ctx) => {
    console.log(ctx.update.message.chat);
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

bot.command('/espresso', async (ctx) => {
    console.log(ctx.update.message.chat);

    let r = await news.newsTC('Inicio do Dia');
    await ctx.replyWithPhoto(r.img)
    await ctx.reply('*======== Espresso ========*', markup)
    await ctx.reply(`*${r.titulo}*`, markup)
    await ctx.reply(`${r.text.substring(0, 3500)}... Continue lendo em https://tc.tradersclub.com.br/tradersclub/channels/tc_news`)

    r.tickers.forEach(async element => {
        console.log(element);
        await ctx.reply(`*${element.name}* - ${element.value} (${element.variation}%)`, markup)

    });
})

var j = schedule.scheduleJob('*/5 * * * *', async function () {
    let r = await news.radarTC(bot);
});

var j = schedule.scheduleJob('05 08 * * *', async function () {
    let r = await news.newsTC('Inicio do Dia');
    rfsIds.gruposTelegram.forEach(async elem => {
        await bot.telegram.sendMessage(elem.id, r.tituloSecao, markup);
        await bot.telegram.sendPhoto(elem.id, r.img);
        await bot.telegram.sendMessage(elem.id, `${r.text.substring(0, 2500)}...`, markup);
    });
});


var j = schedule.scheduleJob('05 19 * * *', async function () {
    let r = await news.newsTC('Fim do Dia');
    rfsIds.gruposTelegram.forEach(async elem => {
        await bot.telegram.sendMessage(elem.id, r.tituloSecao, markup);
        await bot.telegram.sendPhoto(elem.id, r.img);
        await bot.telegram.sendMessage(elem.id, `${r.text.substring(0, 2500)}...`, markup);
    });
});

bot.launch()