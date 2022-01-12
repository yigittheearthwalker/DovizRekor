const fs = require('fs')

const createJsonFileIfNotExists = (fileName) => {
    if (!fs.existsSync('./json/'+fileName+'.json')) {
        initializeJson(fileName);
    }
}
const initializeJson = (fileName) => {
    let data = null;
    switch (fileName) {
        case 'board':
            data = getBoardModel();
            break;
        default:
            data = []
            break;
    }
    fs.writeFileSync('./json/'+fileName+'.json', JSON.stringify(data, null, 2))
}


const getJsonFile = (fileName) => {
    createJsonFileIfNotExists(fileName)
    return JSON.parse(fs.readFileSync('./json/'+fileName+'.json'))
}
const setJsonFile = (filename, data) => {
    fs.writeFileSync('./json/'+filename+'.json', JSON.stringify(data, null, 2))

}

const getBoardModel = () => {
    let data = {
        usd: {},
        euro: {},
        pound: {},
        gold: {}
    };

    let currencyModel = {
        current:{
            dateTime: null,
            value: 0
        },
        hourlyMin: {
            dateTime: null,
            value: 0
        },
        hourlyMax: {
            dateTime: null,
            value: 0  
        },
        dailyMin: {
            dateTime: null,
            value: 0  
        },
        dailyMax: {
            dateTime: null,
            value: 0 
        },
        weeklyMin: {
            dateTime: null,
            value: 0 
        },
        weeklyMax: {
            dateTime: null,
            value: 0 
        },
        monthlyMin: {
            dateTime: null,
            value: 0 
        },
        monthlyMax: {
            dateTime: null,
            value: 0 
        },
        ath: {
            dateTime: null,
            value: 0 
        }
    }

    for (const currency in data) {
        if (Object.hasOwnProperty.call(data, currency)) {
            data[currency] = currencyModel;
        }
    }
    return data;
}

module.exports = {createJsonFileIfNotExists, getJsonFile, setJsonFile}