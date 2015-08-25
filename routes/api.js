var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');

var User   = require('../app/models/user');
var config = require('../config');
var Utils  = require('../app/utils');

function isAuthenticated(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {      
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

/* GET home page. */
router.get('/setup', function(req, res) {
    // create a sample user
    var nick = new User({ 
        email: 'nick@example.com',
        name: 'Nick Cerminara', 
        encrypted_password: 'password',
    
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

router.get('/users', isAuthenticated);
router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        email: email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json(Utils.buildRes(false, 'Authentication failed. User not found.', null));
        } else if (user) {

            // check if password matches
            if (user.encrypted_password != password) {
                res.json(Utils.buildRes(false, 'Authentication failed. Wrong password.', null));
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, config.secret, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json(Utils.buildRes(true, null, {token: token}));
            }   
        }
    });
});

module.exports = router;
