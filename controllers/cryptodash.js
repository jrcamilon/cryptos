let mySql = require('mysql');
let _ = require('lodash');
let env = require('../config.js');
let HttpStatus = require('http-status-codes');
let Errors = require('../errors');
// var config = {
//     user: env.user,
//     password: env.password,
//     host: env.host,
//     port: env.port,
//     database: env.database
// }

var pool = mySql.createPool({
    connectionLimit: 10,
    host: env.host,
    user: env.user,
    password: env.password,
    database: env.database,
    connectionLimit: 100,
    charset: 'utf8mb4',
    debug: false
});

// const pool = new mySql.createConnection(config)
// pool.connect(err => {
//     if (err) console.log(err);
//     else console.log('connected to MySQL database: ', config.database + 'on host: ' + config.host);
// });
/**
 * Get Request for all the currencies
 */

exports.getCurrenciesList = (req, res, next) => {

    const query = `select symbol, name, slug from crypto.markets group by symbol, name, slug;`;

    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message});  
            }
            console.log(connectionError);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
            pool.query(query, (queryError, response) => {
                if (!queryError) {
                    res.status(200).send(response);
                } else {
                    res.status(400).send(queryError);
                }
                conn.release();
                console.log('connection released for query:', query);
            });
        }
    });

    

}

exports.getWidgetCardData = (req,res,next) => {

    const query = `SELECT symbol, t_date, closing, opening, high, low, volume, market from crypto.markets where symbol = `+ `'${req.body.symbol}'` +` ORDER BY t_date DESC LIMIT `+ `${Number(req.body.limit)}`+`;`;

    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({error: connectionError, message: connectionError.message}); // 404
            }
            if (connectionError instanceof Errors.InternalServerError) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: connectionError, message: connectionError.message }); // 500
            }
           
        } else {
            pool.query(query, (queryError, response, fields) => {
                if (!queryError) {
                    res.status(200).send(response);
                } else {
                    res.status(400).send(queryError);
                }
                conn.release();
            });
        }   
    });
}
