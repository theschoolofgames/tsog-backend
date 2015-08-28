var _       = require("lodash");
var jwt     = require('jsonwebtoken');
var merge   = require('merge');
var redis   = require('redis-url');
var client  = redis.connect(process.env.REDIS_URL);
var UnauthorizedAccessError = require('./errors/UnauthorizedAccessError');

var Constants = require('./Constants');
var User      = require('./models/User');


client.on('error', function (err) {
    console.log(err);
});

client.on('connect', function () {
    console.log("Redis successfully connected");
});

module.exports.authenticate = function(token, cb) {
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            cb && cb(err, null);
            return;
        }

        // callback have to handle error
        cb && cb(null, decoded);
    });
};

module.exports.buildRes = function(succeed, message, data) {
    var obj = {
        succeed: succeed,
    };

    if (message)
        obj.message = message;
    if (data) 
        obj = merge(obj, data);

    return obj;
};

module.exports.fetch = function (headers) {
    if (headers && headers.authorization) {
        var authorization = headers.authorization;
        var part = authorization.split(' ');
        if (part.length === 2) {
            var token = part[1];
            return part[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports.create = function (user, req, res, next, cb) {

    // console.log("Create token");

    if (_.isEmpty(user)) {
        return next(new Error('User data cannot be empty.'));
    }

    var data = {
        user_id: user._id,
        username: user.username,
        token: jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
            expiresInMinutes: Constants.TOKEN_TIMEOUT
        })
    };

    var decoded = jwt.decode(data.token);

    data.token_exp = decoded.exp;
    data.token_iat = decoded.iat;

    // console.log("Token generated for user: %s, token: %s", data.username, data.token);

    client.set(data.token, JSON.stringify(data), function (err, reply) {
        if (err) {
            return next(new Error(err));
        }

        if (reply) {
            client.expire(data.token, Constants.TOKEN_TIMEOUT, function (err, reply) {
                if (err) {
                    return next(new Error("Can not set the expire value for the token key"));
                }
                if (reply) {
                    // req.user = data;
                    // next(); // we have succeeded
                    cb && cb(data);
                } else {
                    return next(new Error('Expiration not set on redis'));
                }
            });
        }
        else {
            return next(new Error('Token not set in redis'));
        }
    });

    return data;

};

module.exports.retrieve = function (id, done) {

    console.log("Calling retrieve for token: %s", id);

    if (_.isNull(id)) {
        return done(new Error("token_invalid"), {
            "message": "Invalid token"
        });
    }

    client.get(id, function (err, reply) {
        if (err) {
            return done(err, {
                "message": err
            });
        }

        if (_.isNull(reply)) {
            return done(new Error("token_invalid"), {
                "message": "Token doesn't exists, are you sure it hasn't expired or been revoked?"
            });
        } else {
            var data = JSON.parse(reply);
            console.log("User data fetched from redis store for user: %s", data.username);

            if (_.isEqual(data.token, id)) {
                return done(null, data);
            } else {
                return done(new Error("token_doesnt_exist"), {
                    "message": "Token doesn't exists, login into the system so it can generate new token."
                });
            }

        }

    });

};

module.exports.verify = function (req, res, next) {

    console.log("Verifying token");

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decode) {

        if (err) {
            req.user = undefined;
            return next(new UnauthorizedAccessError("invalid_token"));
        }

        exports.retrieve(token, function (err, data) {

            if (err) {
                req.user = undefined;
                return next(new UnauthorizedAccessError("invalid_token", data));
            }

            User.findOne({_id: data.user_id}, function(err, user) {
                if (err || !user) {
                    return next(new UnauthorizedAccessError("invalid_token"));
                }

                req.user = user;
                next();
            });

        });

    });
};

module.exports.expire = function (req) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    console.log("Expiring token: %s", token);

    if (token !== null) {
        client.expire(token, 0);
    }

    return token !== null;

};

module.exports.middleware = function () {

    var func = function (req, res, next) {

        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        exports.retrieve(token, function (err, data) {

            if (err) {
                req.user = undefined;
                return next(new UnauthorizedAccessError("invalid_token", data));
            } else {
                req.user = _.merge(req.user, data);
                next();
            }

        });
    };

    func.unless = require("express-unless");

    return func;

};