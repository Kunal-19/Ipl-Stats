const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const framework = require("./framework.js");

const url = "https://github.com/topics";
const dirPath = __dirname;

request(url,cb);

function cb(err,response,html){
    if(err) console.log(err);
    else if(response && response.statusCode !==200) console.log(response);
    else extractHtml(html);
}

function extractHtml(html){
    const $ = cheerio.load(html);
    let frame = $(".no-underline.d-flex.flex-column.flex-justify-center");

    for(let i=0; i<frame.length; i++){
        const name = $(frame[i]).find("p.f3");
        const rname = $(name).text().trim();

        const folderPath = path.join(dirPath,rname);
        if(fs.existsSync(folderPath) == false){
            fs.mkdirSync(folderPath);
        }
            
        const link = $(frame[i]).attr("href");
        const clink  = "https://github.com" + link;
        framework.req(clink,folderPath);
    }
}