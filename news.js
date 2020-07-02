const axios = require("axios");
const rfsIds = require("./refIds");
const conexaoDB = require('./db/conexao');
const {
    Telegraf,
    Extra
} = require('telegraf')

const markup = Extra.markdown()

require('dotenv').config();

async function newsTC(periodoDia) {
    let news = await axios('https://tc.tradersclub.com.br/news/api/articles/active', {
        params: {},
        headers: {
            'Authorization': `BEARER ${process.env.TC_TOKEN}`
        }
    })

    return {
        'tituloSecao': `*======== Espresso ${periodoDia} ========*`,
        'img': news.data.banner_url,
        'text': convertHtmlToText(news.data.content),
        'titulo': news.data.title,
        'tickers': news.data.tickers,
    }
}


async function radarTC(bot) {

    rfsIds.usuariosFiltroRadar.forEach(async element => {

        let radar = await axios(`https://tc.tradersclub.com.br/ideas/api/list/user/${element.id}?limit=1`, {
            params: {},
            headers: {
                'Authorization': `BEARER ${process.env.TC_TOKEN}`
            }
        })

        let c1 = await conexaoDB.TCIdeias.findOne({
            where: {
                uid: radar.data[0].id,
            }
        });


        console.log();
        if (c1 == null) {
            let c2 = await conexaoDB.TCIdeias.create({
                uid: radar.data[0].id,
                msg: `------------------------------- \nPor: *${element.usuario}*\n*${radar.data[0].title}*\nTickers *${radar.data[0].tickers}*\nComentário: ${convertHtmlToText(radar.data[0].content)}`,
            });
            rfsIds.gruposTelegram.forEach(elem => {
                bot.telegram.sendMessage(elem.id, `------------------------------- \nPor: *${element.usuario}*\n*${radar.data[0].title}*\nTickers *${radar.data[0].tickers}*\nComentário: ${convertHtmlToText(radar.data[0].content)}`, markup);

            });
        }

    });

}

function convertHtmlToText(text) {
    var inputText = text;
    var returnText = "" + inputText;
    returnText = returnText.replace(/(<([^>]+)>)/g, " ");
    returnText = returnText.replace(/&nbsp;/g, ' ');
    return returnText;
}

module.exports.newsTC = newsTC;
module.exports.radarTC = radarTC;