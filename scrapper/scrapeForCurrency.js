const request = require('request')
const cheerio = require('cheerio')
const config = require('config')

const primaryCurrencySource = () => {
    return new Promise((resolve, reject) => {
        request(config.get('primarySource').url, (error, response, html) => {
            let currencyPackage = {
                usd: null,
                euro: null,
                pound: null,
                god: null
            }
            let dateTime = new Date().addHours(3)
            
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html)
                const currencyListElement = $(config.get('primarySource').container)
                $(currencyListElement).find(config.get('primarySource').element).each((i, item) => {
                    let name = currencyNameConverter($(item).find('.name').text())
                    if (name) {
                        let value = parseFloat((($(item).find('.value').text())
                                                    .replaceAll('.', ''))
                                                    .replaceAll(',', '.'));

                        currencyPackage[name] = {dateTime,value}
                    }
                }) 
                console.log(currencyPackage.usd.value + " is the currency from the package");
                 resolve(currencyPackage) 
            }else if(error){
                reject(error)
            }
        })
    })      
}


  

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
  }
                    
const currencyNameConverter = (rawName) => {
    switch (rawName) {
        case 'DOLAR':
            return "usd"
        case 'GRAM ALTIN':
            return "gold"
        case 'EURO':
            return "euro"
        case 'STERLİN':
            return "pound"
        default:
            return false
    }
}
 
module.exports = {primaryCurrencySource}

