const bovespa = require("bovespa")();
const moment = require("moment");

// Retorna informações de uma ação
async function retornaAcao(cod){
    console.log(moment().format('YYYY-m-d'));
    let acao = await bovespa(cod, moment().format('YYYY-m-d'));
}

module.exports.retornaAcao = retornaAcao;