const bovespa = require("bovespa")();
const axios = require("axios");
const moment = require("moment");
const {
    Telegraf,
    Extra
} = require('telegraf')

const markup = Extra.markdown()

// Retorna informações de uma ação
function retornaAcao(cod, ctx) {
    cod = cod.toUpperCase().trim();

    // bovespa(cod, moment().format('YYYY-MM-DD'))
    bovespa(cod, "2019-04-01").then((resp) => {
        console.log(resp);
        ctx.reply(`Agora em *${resp.codneg}*: PM *${resp.modref}: ${resp.premed}*`, markup);
    }).catch((resp) => {
        console.log(resp);
        ctx.reply(`Desculpe, mercado fechado ou ação inválida!`);
    })
}

async function cotacaoMoeda(moeda) {
    let r = await axios.get(`https://economia.awesomeapi.com.br/json/${moeda.toUpperCase().trim()}`);
    return r.data[0];
}


module.exports.retornaAcao = retornaAcao;
module.exports.cotacaoMoeda = cotacaoMoeda;