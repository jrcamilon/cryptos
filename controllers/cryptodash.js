let mySql = require('mysql');
let _ = require('lodash');
let env = require('../config.js');
var config = {
    user: env.user,
    password: env.password,
    host: env.host,
    port: env.port,
    database: env.database
}

const pool = new mySql.createConnection(config)
pool.connect(err => {
    if (err) console.log(err);
    else console.log('connected to MySQL database: ', config.database + 'on host: ' + config.host);
});
/**
 * Get Request for all the currencies
 */

exports.getCurrenciesList = (req, res, next) => {

    const query = `select symbol, name, slug from crypto.markets group by symbol, name, slug;`;

    pool.query(query, (err, response) => {
        if (err) {
            //handle error
            res.status(400).send(err);
        }  else {
            res.status(200).send(response);
        }
    });

}

exports.getWidgetCardData = (req,res,next) => {
    console.log(req);

    const query = `SELECT symbol, t_date, closing, opening, high, low, volume, market from crypto.markets where symbol = `+ `'${req.body.symbol}'` +` ORDER BY t_date DESC LIMIT `+ `${Number(req.body.limit)}`+`;`;

    pool.query(query, (err, response) => {
        if (err) {
            //handle error
            res.status(400).send(err);
        }  else {
            res.status(200).send(response);
        }
    });
}
