const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const solveIss = require("./solveIssue.js");
const fs = require("fs");

function req(url,folderPath){
    request(url,cb);

    function cb(err,response,html){
        if(err) console.log(err);
        else if(response && response.statusCode !==200) console.log(response);
        else extractHtml(html);
    }

    function extractHtml(html){
        const $ = cheerio.load(html);
        const repos = $(".border.rounded.color-shadow-small.color-bg-subtle.my-4");
    
        for(let i=0; i<repos.length; i++){
            const repoName = $(repos[i]).find(".Link.text-bold.wb-break-word");
            
            const nav = $(repos[i]).find("nav li");
            const issueLink = $(nav[1]).find("a").attr("href");
            const cissLink = "https://github.com" + issueLink;
            solveIss.req(cissLink,$(repoName).text().trim(),folderPath);
        }
    }
}

module.exports = {
    "req" : req
}