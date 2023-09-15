const req = require("request");
const cheerio = require("cheerio");
const chalk = require("chalk");

req('https://www.espncricinfo.com/series/asia-cup-2023-1388374/india-vs-pakistan-9th-match-super-four-1388406/live-cricket-score', cb);     // --> Asynchronous function

function cb(error, response, body) {
    if(error){
        console.error('error:' ,error);
    }else{
        handleHtml(body);
    }
}

function handleHtml(html){
    let setTool = cheerio.load(html);
    let data = setTool('.ds-text-compact-m.ds-text-typo.ds-text-right.ds-whitespace-nowrap strong');
    let score = setTool(data).text();
    console.log(chalk.red(score));
}