const request = require("request");
const cheerio = require("cheerio");
const chalk = require("chalk");

// const url = "https://www.espn.in/cricket/series/21597/game/1388407/sri-lanka-vs-india-10th-match-super-four-asia-cup-2023";

const url = "https://www.espn.in/cricket/series/21597/game/1388401/pakistan-vs-bangladesh-7th-match-super-four-asia-cup-2023";

request(url,cb);

function cb(error,response,body){
    if(error){
        console.error(error);
    }else if(response && response.statusCode !== 200) console.log(response);
    else extractHtml(body);
}

function extractHtml(html){
    const $ = cheerio.load(html);

    let fullScorecard = $(".sub-module.scorecard-summary .react-router-link");
    const scrbd_link = $(fullScorecard).attr("href");
    const fscrbd_link = "https://www.espn.in" + scrbd_link;
    request(fscrbd_link,getBirthDay);
}

function getBirthDay(error,response,body){
    if(error){
        console.error(error);
    }else if(response && response.statusCode !== 200) console.log(response);
    else birthDay(body);
}

function birthDay(html){
    const $ = cheerio.load(html);
    const batsmen = $(".wrap.batsmen");
    for(let i = 0; i<batsmen.length;i++){
        const link = $(batsmen[i]).find('a').attr("href");
        const player_prof_link = link;
        request(player_prof_link,helper);
    }
}

function helper(error,response,body){
    if(error) console.log(error);
    else if(response && response.statusCode !==200) console.log(response);
    else getHelp(body);
}

function getHelp(html){
    let $ = cheerio.load(html);
    let details = $(".ds-grid.ds-mb-8  .ds-text-title-s.ds-font-bold.ds-text-typo");
    console.log(`${chalk.green($(details[0]).text())}:` + chalk.yellowBright($(details[1]).text()) + `\n`);
}