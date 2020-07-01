const axios = require("axios");
require('dotenv').config();

async function newsTC() {
    let news = await axios('https://tc.tradersclub.com.br/news/api/articles/active', {
        params: {},
        headers: {
            'Authorization': `BEARER ${process.env.TC_TOKEN}`
        }
    })

    return {
        'img': news.data.banner_url,
        'text': convertHtmlToText(news.data.content),
        'titulo': news.data.title,
        'tickers': news.data.tickers,
    }
}

function convertHtmlToText(text) {
    var inputText = text;
    var returnText = "" + inputText;
    returnText = returnText.replace(/(<([^>]+)>)/g, "");
    returnText = returnText.replace(/&nbsp;/g, '');
    return returnText;
}

module.exports.newsTC = newsTC;