const {
    Telegraf
} = require('telegraf')
const Keyboard = require('telegraf-keyboard');
const keyboard = new Keyboard(options);
const commandos = require('./comandos');

const bot = new Telegraf(process.env.BOT_TOKEN)

// Keyboard menu boas vindas
keyboard
    .add('Boas Vindas', '/IBOV')
    .add('/Dolar')

// Boas vindas
bot.start((ctx) => {
    ctx.reply('Fala, Traders!!! 😉! \nSou a Botina! Vou facilitar sua vida como trader, para começa, escolha uma das opações abaixos.', {
        reply_markup: 'markdown'
    })
    bot.reply('Keyboard', keyboard.draw())
})

// Comandos
bot.command('/acao', (ctx) => {
    commandos.retornaAcao('ABEV3');
})

bot.launch()