const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const dirPath = process.cwd();

function req(url) {
    request(url, cb);
}

function cb(error, response, body) {
    if (error) {
        console.error(error);
    } else if (response && response.statusCode !== 200) {
        console.error(`HTTP Error: ${response.statusCode}`);
    } else {
        extractHtml(body);
    }
}

function extractHtml(html) {
    const $ = cheerio.load(html);
    const teams = createFiles(html);
    if (teams.length === 2) {
        getStats(html, teams);
    } else {
        console.error("Expected two teams, but found:", teams);
    }
}

// Create team folders
function createFiles(html) {
    const $ = cheerio.load(html);
    const stats = $(".ds-rounded-lg.ds-mt-2 .ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-rounded-xl.ds-border.ds-border-line.ds-mb-4");

    const teams = [];
    for (let i = 0; i < stats.length && i < 2; i++) {
        const teamName = $(stats[i]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
        const teamPath = path.join(dirPath, "IPL", teamName);

        if (!fs.existsSync(teamPath)) {
            fs.mkdirSync(teamPath);
            const batsman = path.join(teamPath, "BatsMan");
            const bowler = path.join(teamPath, "Bowler");
            fs.mkdirSync(batsman);
            fs.mkdirSync(bowler);
        }

        teams.push(teamName);
    }
    return teams;
}

function getStats(html, teams) {
    const $ = cheerio.load(html);

    const matchDetails = $(".ds-text-tight-m.ds-font-regular.ds-text-typo-mid3");
    const details = $(matchDetails).text().split(',');
    const venue = details[1];
    const date = details[2].trim() + ',' + details[3].trim();

    const stats = $(".ds-rounded-lg.ds-mt-2");
    const teamPath1 = path.join(dirPath, "IPL", teams[0]);
    const teamPath2 = path.join(dirPath, "IPL", teams[1]);

    for (let i = 0; i < stats.length; i++) {
        const teamName = $(stats[i]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
        const opponentName = teams.find(team => team !== teamName);
        const batPath = path.join((teamName === teams[0] ? teamPath1 : teamPath2), "BatsMan");
        const bowlPath = path.join((teamName === teams[0] ? teamPath2 : teamPath1), "Bowler");

        const tables = $(stats[i]).find(".ds-p-0 table");

        for (let j = 0; j < tables.length; j++) {
            const scores = $(tables[j]).find("tbody tr");
            if (j % 2 === 1) {
                bowlerStats(scores, teamName, bowlPath, date, venue);
            } else {
                batsmanStats(scores, opponentName, batPath, date, venue);
            }
        }
    }
}

function batsmanStats(scores, opponentName, batPath, date, venue) {
    for (let k = 0; k < scores.length; k++) {
        if(scores.eq(k).find("div").hasClass("ds-font-regular")) continue;
        if(scores.eq(k).hasClass("ds-text-tight-s") == true) break;

        const playerDetails = scores.eq(k).find("td");

        const playerObj = {
            "Date": date,
            "Opponent's Name": opponentName,
            "Venue": venue,
            "Player Name": playerDetails.eq(0).text(),
            "Runs": playerDetails.eq(2).text(),
            "Balls": playerDetails.eq(3).text(),
            "Fours": playerDetails.eq(5).text(),
            "Sixes": playerDetails.eq(6).text(),
            "Strike Rate": playerDetails.eq(7).text()
        };
        processPlayer(playerObj, batPath);
    }
}

function bowlerStats(scores, opponentName, bowlPath, date, venue) {
    for (let k = 0; k < scores.length; k++) {
        if(scores.eq(k).find("div").hasClass("ds-font-regular")) continue;
        if(scores.eq(k).hasClass("ds-text-tight-s") == true) break;
        const playerDetails = scores.eq(k).find("td");

        const playerObj = {
            "Date": date,
            "Opponent's Name": opponentName,
            "Venue": venue,
            "Player Name": playerDetails.eq(0).text(),
            "Overs": playerDetails.eq(1).text(),
            "Maiden": playerDetails.eq(2).text(),
            "Runs": playerDetails.eq(3).text(),
            "Wickets": playerDetails.eq(4).text(),
            "Economy": playerDetails.eq(5).text(),
            "Dots": playerDetails.eq(6).text(),
            "Fours": playerDetails.eq(7).text(),
            "Sixes": playerDetails.eq(8).text(),
            "Wide": playerDetails.eq(9).text(),
            "Nb": playerDetails.eq(10).text()
        };
        processPlayer(playerObj, bowlPath);
    }
}

function processPlayer(playerObj, fpath) {
    if (!playerObj["Player Name"].trim()) return;
    const playerFilePath = path.join(fpath, `${playerObj["Player Name"].trim()}.xlsx`);

    let content = readFile(playerFilePath, "Sheet-1");
    content.push(playerObj);
    writeFiles(playerFilePath, content, "Sheet-1");
}

function writeFiles(filePath, json, sheetName) {
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
    try {
        xlsx.writeFile(workBook, filePath);
    } catch (err) {
        console.error("Error writing file:", err);
    }
}

function readFile(filePath, sheetName) {
    if (!fs.existsSync(filePath)) return [];
    const wb = xlsx.readFile(filePath);
    const excelData = wb.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(excelData);
}

module.exports = {
    "req": req
};
