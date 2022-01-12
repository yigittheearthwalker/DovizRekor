const express = require('express')
const logger = require('morgan')
const cron = require('node-cron');
const {pulseForCurrencies} = require('./functions/pulse')
const {createJsonFileIfNotExists} = require('./functions/jsonHandler')


const app = express()

app.use(logger('dev'))


createJsonFileIfNotExists('board');

cron.schedule('* * * * *', () => {
    pulseForCurrencies();
});

cron.schedule('0 * * *', () => {
    console.log("Time has come");
});

app.get('/', (req, res) => {
    res.json({root: {
        message: "Hello"
    }})
    
})
app.listen(8888, () => console.log('Server started... Listening to the wind of port 8888'))