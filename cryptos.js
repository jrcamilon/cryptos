let express = require('express');
let http = require('http');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let app = express();
let router = require('./router.js');
let path = require('path');

const publicDirectoryPath = path.join(__dirname, './public');

//App Set Up
app.use(morgan('combined'));
app.use(bodyParser.json({typer:'*/*'}));

// Setting the headers for all routes to be CORS compliant
app.use(function(req,res,next) {
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
next(); });

// serve static html files
app.use(express.static(publicDirectoryPath));

router(app);

//Server Setup
var port = process.env.PORT || 3093;
let server = http.createServer(app);
server.listen(port);

console.log("Server running at http://localhost:%d", port);
