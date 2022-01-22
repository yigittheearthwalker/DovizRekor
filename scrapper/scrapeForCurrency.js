const request = require('request')
const cheerio = require('cheerio')
const {primarySource} = require('../config/config')

const{USD, EURO, POUND, GOLD} = require('../utils/types')

const primaryCurrencySource = () => {
    return new Promise((resolve, reject) => {
        request(primarySource.url, (error, response, html) => {
            let currencyPackage = {}
            let dateTime = new Date()
            
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html)
                const currencyListElement = $(primarySource.container)
                $(currencyListElement).find(primarySource.element).each((i, item) => {
                    let name = currencyNameConverter($(item).find('.name').text())
                    if (name) {
                        let value = parseFloat((($(item).find('.value').text())
                                                    .replaceAll('.', ''))
                                                    .replaceAll(',', '.'));

                        currencyPackage[name] = {dateTime,value}
                    }
                }) 
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
            return USD
        case 'GRAM ALTIN':
            return GOLD
        case 'EURO':
            return EURO
        case 'STERLİN':
            return POUND
        default:
            return false
    }
}
 
module.exports = {primaryCurrencySource}

