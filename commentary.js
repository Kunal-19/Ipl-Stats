const request = require("request");
const cheerio = require("cheerio");
const chalk = require("chalk");

request('https://www.espncricinfo.com/series/indian-premier-league-2023-1345038/gujarat-titans-vs-mumbai-indians-qualifier-2-1370352/live-cricket-score', cb);

function cb(error, response, body) {
    if (error) {
        console.error('Error:', error);
    } else if (response && response.statusCode !== 200) {
        console.error('HTTP Error:', response.statusCode);
    } else {
        handleHtml(body);
    }
}

function handleHtml(html) {
    let $ = cheerio.load(html);
    let comments = $(".ds-ml-4.ds-text-typo-mid1 .ci-html-content");
    let element = $(comments[0]).text();
    console.log(element);
}
