var keystone    = require('keystone');

var User      = keystone.list('User');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

var BadRequestError = require('../errors/BadRequestError');

module.exports.register = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.model
        .findOne()
        .where('name', username).exec(function(err, user) {
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

                    res.json(newUser.asJson());
                })
            }
        })
}