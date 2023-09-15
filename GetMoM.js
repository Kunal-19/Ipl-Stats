const request = require("request");
const cheerio = require("cheerio");
const chalk = require("chalk");

request('https://www.espncricinfo.com/series/asia-cup-2023-1388374/sri-lanka-vs-india-10th-match-super-four-1388407/full-scorecard', cb);

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
    // console.log($);
    let comments = $(".ds-px-4.ds-py-2.ds-self-stretch.ds-w-full.ds-border-line .ds-inline-flex.ds-items-start.ds-leading-none");
    
    if (comments.length === 0) {
        console.log('No comments found.');
    } else {
        console.log($(comments).text());
    }
}
