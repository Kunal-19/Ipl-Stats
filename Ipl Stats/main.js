const request = require("request");
const cheerio = require("cheerio");
const results = require("./results.js");

url = "https://www.espncricinfo.com/series/indian-premier-league-2023-1345038";

request(url,cb);

function cb(error,response,body){
    if(error){
        console.error(error);
    }else if(response && response.statusCode !== 200) console.log(response);
    else extractHtml(body);
}

function extractHtml(html){
    const $ = cheerio.load(html);
    const next = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2").find("a").attr("href");
    const link = "https://www.espncricinfo.com" + next;
    results.req(link);
}