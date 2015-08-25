var _               = require("lodash");
var jwt             = require('jsonwebtoken');
var passwordHash    = require('password-hash');

var User        = require('../models/User');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

var UnauthorizedAccessError = require('../errors/UnauthorizedAccessError');

module.exports.login = function(req, res, next) {
    var username = req.body.user_name.toLowerCase();
    var password = req.body.user_password;
    var device_id = req.body.device_id;

    if (_.isEmpty(username) || _.isEmpty(password)) {
        return next(new UnauthorizedAccessError("401", {
            message: 'Invalid username or password'
        }));
    }
    
    User.findOne({ username: username }, function(err, user) {
        if (err || !user) {
            return next(new UnauthorizedAccessError("401", {
                message: 'Invalid username or password'
            }));
        }

        if (user.comparePassword(password)) {
            Utils.create(user, req, res, next, function(data) {
                res.json(Utils.buildRes(true, null, data));
            });
        }
        else {
            return next(new UnauthorizedAccessError("401", {
                message: 'Invalid username or password'
            }));
        }
    });

};

module.exports.register = function(req, res, next) {
    var username = req.body.user_name.toLowerCase();
    var password = req.body.user_password;
    var device_id = req.body.device_id

    User.findOne({ username: username }, function(err, user) {
        if (err) throw err;

        if (user) {
            res.json(Utils.buildRes(false, "Register failed. User exist", null));
        } else {
            var newUser = new User({ 
                username: username,
                password: password,
                device_id: device_id
            });

            newUser.save(function(err) {
                if (err) throw err;

                Utils.create(newUser, req, res, next, function(data) {
                    res.json(Utils.buildRes(true, null, data));
                });
            });
        }
    })
};

module.exports.logout = function(req, res, next) {
    if (Utils.expire(req)) {
        delete req.user;
        return res.json(Utils.buildRes(true, "User has been successfully logged out", null));
    } else {
        return next(new UnauthorizedAccessError("401"));
    }
};