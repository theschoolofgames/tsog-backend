require('dotenv').load({path: 'tsog.env'});
require('newrelic');

var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
// Database
var mongo           = require('mongodb');
var mongoose        = require('mongoose');

var NotFoundError   = require('./lib/errors/NotFoundError');

var app = express();

// Bug reporting
var rollbar = require("rollbar");
app.use(rollbar.errorHandler('6b50f202f2c5428794ff598b8ba5391c'));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to database
mongoose.connect(process.env.MONGODB_URI); // connect to database

// Routes
var routes = require('./routes/index');
var api_routes = require('./routes/api');
app.use('/', routes);
app.use('/api', api_routes);

// all other requests redirect to 404
app.all("*", function (req, res, next) {
    next(new NotFoundError("404"));
});

// error handler for all the applications
app.use(function (err, req, res, next) {

    var errorType = typeof err,
        code = 500,
        msg = { 
            succeed: false,
            code: code,
            message: "Internal Server Error"
        };

    switch (err.name) {
        case "UnauthorizedError":
        case "BadRequestError":
        case "UnauthorizedAccessError":
        case "NotFoundError":
            code = err.status;
            msg.code = code;
            msg.message = err.message;
            break;
        default:
            console.log(err.stack);
            break;
    }

    return res.status(code).json(msg);

});


module.exports = app;
