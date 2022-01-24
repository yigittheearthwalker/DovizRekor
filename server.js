const express = require('express')
const logger = require('morgan')
const cron = require('node-cron');
const {pulseForCurrencies, getCurrencyInfo} = require('./functions/pulse')
const {createJsonFileIfNotExists} = require('./functions/jsonHandler')
const {client} = require('./functions/dbHandler')


const app = express()

app.use(logger('dev'))


createJsonFileIfNotExists('board');

cron.schedule('* * * * *', () => {
    pulseForCurrencies();
    //getMaxAndMins();
});

//Every day at midnight
//cron.schedule('0 0 0* * *', () => {
//    console.log("Time has come");
//});

app.get('/', async(req, res) => {
    let c = await getCurrencyInfo();
    console.log(c);
    res.json(c)
    
})
app.listen(8050, () => console.log('Server started... Listening to the wind of port 8050'))