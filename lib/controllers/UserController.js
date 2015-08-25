var jwt             = require('jsonwebtoken');
var passwordHash    = require('password-hash');

var User        = require('../models/User');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

module.exports = {
    login: function(req, res) {
        var name = req.body.user_name.toLowerCase();
        var password = req.body.user_password;
        var device_id = req.body.device_id

        User.findOne({ name: name }, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.json(Utils.buildRes(false, 'Authentication failed. User not found.', null));
            } else if (user) {

                // check if password matches
                if (!passwordHash.verify(password, user.encrypted_password)) {
                    res.json(Utils.buildRes(false, 'Authentication failed. Wrong password.', null));
                } 
                else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, process.env.TOKEN_SECRET, {
                        expiresInMinutes: Constants.TOKEN_TIMEOUT
                    });

                    // return the information including token as JSON
                    res.json(Utils.buildRes(true, null, {
                        token: token,
                        user_id: user._id
                    }));
                }   
            }
        });
    },

    register: function(req, res) {
        var name = req.body.user_name.toLowerCase();
        var password = req.body.user_password;
        var device_id = req.body.device_id

        User.findOne({ name: name }, function(err, user) {
            if (err) throw err;

            if (user) {
                res.json(Utils.buildRes(false, "Register failed. User exist", null));
            } else {
                var newUser = new User({ 
                    name: name,
                    encrypted_password: passwordHash.generate(password),
                    device_id: device_id
                });

                newUser.save(function(err) {
                    if (err) throw err;

                    var token = jwt.sign(newUser, process.env.TOKEN_SECRET, {
                        expiresInMinutes: Constants.TOKEN_TIMEOUT 
                    });

                    res.json(Utils.buildRes(true, null, {
                        token: token,
                        user_id: newUser._id
                    }));
                });
            }
        })
    },

    logout: function(req, res) {
        User.findOne({_id: req.decoded._id}, function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json(Utils.buildRes(false, 'Authentication failed. User not found.', null));
            } else {
                
            }
        });
    }
}