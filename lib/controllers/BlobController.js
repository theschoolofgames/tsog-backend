var _           = require("lodash");

var UserBlob    = require('../models/UserBlob');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

var UnauthorizedAccessError = require('../errors/UnauthorizedAccessError');

module.exports.getBlob = function(req, res, next) {
    var gameId = req.query.game_id;

    if (_.isEmpty(gameId)) {
        return next(new UnauthorizedAccessError("401", {
            message: 'Invalid game id.'
        }));
    }

    UserBlob.findOne({ userId: req.user._id, gameId: gameId}, function(err, userBlob) {
        if (err) 
            return next(new Error(err));

        var blob = userBlob ? userBlob.blob : "";
        res.json(Utils.buildRes(true, null, { blob: blob }));
    });
}

module.exports.postBlob = function(req, res, next) {
    var blob = req.body.blob;
    var gameId = req.body.game_id;

    if (_.isEmpty(gameId)) {
        return next(new UnauthorizedAccessError("401", {
            message: 'Invalid game id.'
        }));
    }

    UserBlob.findOne({ userId: req.user._id }, function(err, userBlob) {
        if (err) 
            return next(new Error(err));

        if (!userBlob) {
            userBlob = new UserBlob({
                userId: req.user._id,
                gameId: gameId,
                blob: blob
            });
        }

        userBlob.blob = blob;
        userBlob.save(function(err) {
            if (err) throw err;

            res.json(Utils.buildRes(true));
        });
    });
}