const {primaryCurrencySource} = require("../scrapper/scrapeForCurrency")
const {getJsonFile, setJsonFile} = require("../functions/jsonHandler");

const{HOURLY_MAX, 
      HOURLY_MIN,
      HOURLY_NORMAL} = require('../utils/types')


const pulseForCurrencies = () => {
        primaryCurrencySource().then(package => {
           
            let boardJson = getJsonFile('board')

            for (const key in boardJson) {
                if (Object.hasOwnProperty.call(boardJson, key)) {
                    let currencyReceived = package[key];
                    let currencyBoarded = boardJson[key];

                    currencyBoarded["current"] = currencyReceived;

                    let time = new Date().getHours();
                    if (time >= 9 && time <= 18) {
                            
                        let shouldCheckHourlyRates = true;

                        if (currencyBoarded.hourlyMax.value == 0) {
                            currencyBoarded.hourlyMax = currencyReceived;
                            shouldCheckHourlyRates = false;
                        }
                        if (currencyBoarded.hourlyMin.value == 0) {
                            currencyBoarded.hourlyMin = currencyReceived;
                            shouldCheckHourlyRates = false;
                        }
    
                        if (shouldCheckHourlyRates) {
                            let hourlyResult = checkHourlyRate(currencyReceived, key)
                            if (hourlyResult != HOURLY_NORMAL) {
                                if (hourlyResult === HOURLY_MAX) {
                                    currencyBoarded["hourlyMax"] = currencyReceived
                                }else if (hourlyResult === HOURLY_MIN){
                                    currencyBoarded["hourlyMin"] = currencyReceived
                                }
                            }
                        }
                    }

                    checkOtherPeriodicalsAndAth(currencyBoarded, currencyReceived, key)
                }
            }
            setJsonFile('board', boardJson);
       }).catch(err => console.log(err))
}

const checkHourlyRate = (currencyReceived, key) => {
            let hourlyJson = getJsonFile(key+'Hourly')
            if (hourlyJson.length > 59) {
                hourlyJson.splice(0, 1)
            }
            
            let result = null;
            let isMax = hourlyJson.filter(e => e.value >= currencyReceived.value).length == 0 ? true : false;
            let isMin = hourlyJson.filter(e => e.value <= currencyReceived.value).length == 0 ? true : false;

            hourlyJson.push(currencyReceived)

            if (isMax) {
                result = HOURLY_MAX
            }else if(isMin){
                result = HOURLY_MIN
            }else{
                result = HOURLY_NORMAL
            }
            setJsonFile(key+'Hourly', hourlyJson)
            return result
}

const checkOtherPeriodicalsAndAth = (currencyBoarded, currencyReceived, currencyName) => {

    let receivedValue = currencyReceived.value

    for (const key in currencyBoarded) {
        if (Object.hasOwnProperty.call(currencyBoarded, key)) {
            if (key.endsWith('Max')) {
                if (receivedValue > currencyBoarded[key].value) {
                    currencyBoarded[key] = currencyReceived;
                    console.log(currencyName + " is reached to the " + key);
                }
            }else if(key.endsWith('Min')){
                if (receivedValue < currencyBoarded[key].value) {
                    currencyBoarded[key] = currencyReceived;
                    console.log(currencyName + " is reached to the " + key);
                }
            }else if(key === 'ath'){
                if (receivedValue > currencyBoarded[key].value) {
                    currencyBoarded[key] = currencyReceived;
                    console.log(currencyName + " is reached to the " + key);
                }
            }
            
        }
    }





}

const logCurrencyEvent = () => {

}


module.exports = {pulseForCurrencies}
