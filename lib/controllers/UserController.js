var keystone    = require('keystone');

var User      = keystone.list('User');
var Constants   = require('../Constants');
var Utils       = require('../Utils');
var Token       = require('../Token');

var BadRequestError = require('../errors/BadRequestError');
var NotFoundError   = require('../errors/NotFoundError');

module.exports.register = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.model
        .findOne()
        .where('name', username).exec(function(err, user) {
            if (err)
                return next(new UnauthorizedAccessError({ message: 'An error has occurred - ' + err }));

            if (user) {
                return next(new BadRequestError({
                    message: 'Username\'s already taken'
                }));
            } else {
                var newUser = new User.model({
                    name: username,
                    password: password
                });

                newUser.save(function(err) {
                    if (err) return next(err);
                    res.json(Utils.buildRes(true, null, newUser.asJson({
                        access_token: Token.createUserToken(newUser._id)
                    })));
                })
            }
        })
}

module.exports.login = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.model
        .findOne()
        .where('name', username).exec(function(err, user) {
            if (err)
                return next(new UnauthorizedAccessError({ message: 'An error has occurred - ' + err }));

            if (!user) 
                return next(new NotFoundError({ message: 'No user has been found.' }));

            user._.password.compare(password, function(err, isMatch) {
                if (!err && isMatch) {
                    res.json(Utils.buildRes(true, null, user.asJson({
                        access_token: Token.createUserToken(user._id)
                    })));
                } else {
                    next(new UnauthorizedAccessError({ message: 'An error has occurred - ' + err }));                        
                }
            })
        })
}