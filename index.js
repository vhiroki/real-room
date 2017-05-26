const fs = require('fs');

const inputList = fs.readFileSync('./input.txt').toString().split('\n');

const getRoomName = (data) => {
    const openingBracketIndex = data.indexOf('[');
    const nameWithSector = data.slice(0, openingBracketIndex);
    const indexOfLastDash = data.lastIndexOf("-");
    return data.slice(0, indexOfLastDash).split('-').join('');
};

const createRankMap = (name) => {
    const chars = name.split('');
    return chars.reduce((map, char) => {
        if (map[char]) {
            map[char] = map[char] + 1;
        } else {
            map[char] = 1;
        }
        return map;
    }, {});
};

const getChecksum = (data) => {
    const regexp = /\[(.*)]/;
    var match = regexp.exec(data);
    return match[1];
};

const getSectorID = (data) => {
    const regexp = /\-([0-9]*)\[/;
    var match = regexp.exec(data);
    return parseInt(match[1]);
};

const getChecksumGuess = (rankMap) => {
    const charsObjList = Object.keys(rankMap)
        .filter(char => rankMap.hasOwnProperty(char))
        .map(char => ({
            char: char,
            count: rankMap[char]
        }));

    const orderedCharsObjList = charsObjList.sort((a, b) => {
        if (a.count < b.count) {
            return -1;
        }
        if (a.count > b.count) {
            return 1;
        }
        const result = -a.char.localeCompare(b.char);
        return result;
    });

    return orderedCharsObjList
        .reverse()
        .slice(0, 5)
        .map(charObj => charObj.char)
        .join('');
};

const exec = (inputList) => {
    const result = inputList.reduce((sum, data) => {
        if (!data || data === "") {
            return sum;
        }

        const roomName = getRoomName(data);
        const rankMap = createRankMap(roomName);
        const checksumGuess = getChecksumGuess(rankMap);
        const checksum = getChecksum(data);
        const sectorID = getSectorID(data);

        return sum + (checksum === checksumGuess ? sectorID : 0);
    }, 0);

    console.log(result);
};

exec(inputList);

