const request = require("request");
const cheerio = require("cheerio");
const chalk = require("chalk");

const url = "https://www.espn.in/cricket/series/21597/game/1388407/sri-lanka-vs-india-10th-match-super-four-asia-cup-2023";

// const url = "https://www.espn.in/cricket/series/21597/game/1388401/pakistan-vs-bangladesh-7th-match-super-four-asia-cup-2023";

request(url,cb);

function cb(error,response,body){
    if(error){
        console.error(error);
    }else if(response && response.statusCode !== 200) console.log(response);
    else extractHtml(body);
}

function extractHtml(html){
    const $ = cheerio.load(html);

    let result = $(".cscore_notes_game");

    //Getting the winning team
    let res = $(result[0]).text().split("won");
    let wteam = res[0];
    wteam = wteam.trim();
    wteam = wteam.toLowerCase();


    //Getting highlights for both the innings
    let inningsArr = $(".inning");
    for(let i=0; i<inningsArr.length; i++){
        let teamDetails = $(inningsArr[i]).find("h4");
        let top = $(teamDetails).text();
        const resultArray = top.split(/\d+/);
        
        let team = resultArray[0];
        team = team.trim();
        team = team.toLowerCase();

        if(team != wteam){
            let bowlerDetails = $(inningsArr[i]).find('.two-col-table').find("li");
            const bowler_stats = $(bowlerDetails[2]).text();
            const bowler = bowler_stats.split(/\d+/);
            console.log(`Highest Wicket taker for ${chalk.blue(wteam[0].toUpperCase() + wteam.slice(1))} : ` + chalk.red(bowler[0]));
            break;
        }
    }
}