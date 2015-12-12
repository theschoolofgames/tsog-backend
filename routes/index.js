/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

var NotFoundError   = require('../lib/errors/NotFoundError');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
    seed: importRoutes('./seed'),
    controllers: importRoutes('../lib/controllers')
};

// Setup Route Bindings
exports = module.exports = function(app) {

    // Bug reporting
    var rollbar = require("rollbar");
    app.use(rollbar.errorHandler('6b50f202f2c5428794ff598b8ba5391c'));

    // New Relic
    require('../newrelic');
	
	// Views
	app.get('/', routes.views.index);
    // app.use('/api/seed', routes.seed.seed);

    app.get('/api/schools', routes.controllers.SchoolController.getSchools);
    app.post('/api/schools', routes.controllers.SchoolController.createSchool);
    app.get('/api/accounts', routes.controllers.SchoolController.getAccounts);
    app.get('/api/games', routes.controllers.GameController.getGames);
    app.post('/api/students', routes.controllers.StudentController.createStudent);

    app.post('/api/gameProgress', routes.controllers.StudentGameController.gameProgress);
	
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

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
	
};
