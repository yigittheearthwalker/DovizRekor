const {Client} = require('pg')
const {dbUser, dbHost, dbName, dbPass, dbPort} = require('../config/config')

const client = new Client({
    user: dbUser,
    host: dbHost,
    database: dbName,
    password: dbPass,
    port: dbPort,
  })

  client.connect();

  const dbWrite = (query, values) => {
      return new Promise((resolve, reject) =>
        client.query(query, values, (err, res) => {
            if (err) {
              reject(err.stack)
            } else {
              resolve(res.rows[0]);
            }
          })

      )
  }



  module.exports = {client, dbWrite}