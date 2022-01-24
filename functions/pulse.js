const {primaryCurrencySource} = require("../scrapper/scrapeForCurrency")
const {getJsonFile, setJsonFile} = require("../functions/jsonHandler");
const {client} = require('./dbHandler')
const {v4} = require('uuid')


const{HOURLY_MAX, 
      HOURLY_MIN,
      HOURLY_NORMAL} = require('../utils/types');


const pulseForCurrencies =  () => {
        primaryCurrencySource().then(package => {
            console.log(package);
            for (const key in package) {
                if (Object.hasOwnProperty.call(package, key)) {
                    let query = "INSERT INTO pulses(id, currency, value, receive_date) VALUES ($1, $2, $3, $4)"
                    const values = [v4(), key, package[key].value, package[key].dateTime];

                    client.query(query, values, (err, res) => {
                        if (err) {
                          console.log(err.stack)
                        } 
                      })

                }
            }
       }).catch(err => console.log(err))
}

const getCurrencyInfo = () => {
    const query = {
        name: 'fetch-currencies',
        text: 'select '
            + 'p1.currency, '
            + '(select value from pulses p2 where p2.currency = p1.currency order by receive_date desc limit 1) as last_value, '
            + 'max(p1.value) as ath, '
            + '(select max(p3.value) from pulses p3 where p3.currency = p1.currency and date(p3.receive_date) = date(now())) as maxToday,'
            + '(select min(p3.value) from pulses p3 where p3.currency = p1.currency and date(p3.receive_date) = date(now())) as minToday '
            + 'from pulses p1 '
            + 'group by p1.currency '
        
      }
      return new Promise((resolve, reject) => {
        client.query(query, (err, res) => {
            if (err) {
              reject(err.stack)
            } else {
                console.log(res.rows);
                resolve(res.rows) 
            }
          })
      }) 
      
}





/*const checkHourlyRate = (currencyReceived, key) => {
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

}*/


module.exports = {pulseForCurrencies, getCurrencyInfo}
