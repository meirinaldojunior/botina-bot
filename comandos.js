const bovespa = require("bovespa")();
const axios = require("axios");
const moment = require("moment");
const {
    Telegraf,
    Extra
} = require('telegraf')
require('dotenv').config();

const markup = Extra.markdown()

// Retorna informações de uma ação
async function retornaAcao(cod, ctx) {
    cod = cod.toUpperCase().trim();

    var r = await axios.get(`https://api.hgbrasil.com/finance/stock_price?key=${process.env.HGBRASIL_TOKEN_API}&symbol=${cod}`)

    if(firstInObject(r.data.results).error){
        ctx.reply(`Código da ação inválido 😕`, markup);
    }else{
        ctx.reply(`Agora em *${firstInObject(r.data.results).symbol}*: PM *${firstInObject(r.data.results).price}: ${firstInObject(r.data.results).change_percent} %*`, markup);
    }

}

async function cotacaoMoeda(moeda) {
    let r = await axios.get(`https://economia.awesomeapi.com.br/json/${moeda.toUpperCase().trim()}`);
    return r.data[0];
}

function firstInObject(obj)
{
        for (var key in obj) return obj[key];
}


module.exports.retornaAcao = retornaAcao;
module.exports.cotacaoMoeda = cotacaoMoeda;