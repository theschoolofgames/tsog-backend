var express         = require('express');
var router          = express.Router();
var jwt             = require('jsonwebtoken');
var passwordHash    = require('password-hash');

var Utils       = require('../lib/Utils');
var User        = require('../lib/models/User');

var UserController = require('../lib/controllers/UserController');

function isAuthenticated(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {      
            if (err) {
                return res.json(Utils.buildRes(false, 'Failed to authenticate token.', null));
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;    
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send(Utils.buildRes(false, 'No token provided.', null));
    }
};

// router.get('/users', isAuthenticated);
router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/logout', isAuthenticated, UserController.logout);

module.exports = router;
