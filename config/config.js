module.exports = {
    //Postgres DB Related
    dbUser: process.env.DR_DB_USER,
    dbHost: process.env.DR_DB_HOST,
    dbName: process.env.DR_DB,
    dbPass: process.env.DR_DB_PASSWORD,
    dbPort: process.env.DR_DB_PORT,
    
    //Scrapper Related
    primarySource: {
        url:  "https://www.doviz.com/",
        container:  ".market-data",
        element: ".item"
    }
}