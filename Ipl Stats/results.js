const request = require("request");
const cheerio = require("cheerio");
const scorecard = require("./scoreCard1.js");
const fs = require("fs");
const path = require("path");

function req(url){
    request(url,cb);
}

function cb(error,response,body){
    if(error){
        console.error(error);
    }else if(response && response.statusCode !== 200) console.log(response);
    else extractHtml(body);
}

const dirPath = process.cwd();

function extractHtml(html){
    const $ = cheerio.load(html);
    const nextPage = $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent");
    if(nextPage.length == 0) return ;
    else{
        const nxtdirPath = path.join(dirPath,"IPL");
        if(fs.existsSync(nxtdirPath) == false)
            fs.mkdirSync(nxtdirPath);
    } 
    let n = nextPage.length;
    for(let i = 0; i<n; i++){
        const link = $(nextPage[i]).find("a").attr("href");
        const clink = "https://www.espncricinfo.com" + link;
        
        scorecard.req(clink);
    }
}

module.exports = {
    "req" : req
}