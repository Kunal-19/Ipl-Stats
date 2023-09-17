const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const PDFDocument = require('pdfkit');
const fs = require("fs");

function req(url,repoName,folderPath){
    request(url,cb);

    function cb(err,response,html){
        if(err) console.log(err);
        else if(response && response.statusCode !==200) console.log(response);
        else generateIssues(html);
    }

    function generateIssues(html){
        const $ = cheerio.load(html);
        const issues = $(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
        let issuesArr = [];

        for(let i = 0; i<issues.length; i++){
            const link = $(issues[i]).attr("href");
            const clink = "https://github.com" + link;
            issuesArr.push(clink);
        }
        generatePdf(issuesArr);
    }

    function generatePdf(issuesArr) {
        if (issuesArr.length === 0) return;
    
        let filePath = path.join(folderPath, repoName + ".pdf");
        
        // Join the elements of issuesArr into a single string with line breaks
        let text = issuesArr.join('\n');
        
        let pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(filePath));
        
        pdfDoc.text(text);
        pdfDoc.end();
    }    
}

module.exports = {
    "req" : req
}