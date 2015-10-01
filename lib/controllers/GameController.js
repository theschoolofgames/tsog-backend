var User        = require('../models/User');
var Game        = require('../models/Game');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

var UnauthorizedAccessError = require('../errors/UnauthorizedAccessError');

module.exports.getGames = function(req, res, next) {
    var userId = req.query.user_id;

    User.findOne({ _id: userId })
        .populate('games')
        .exec(function(err, user) {
            if (err || !user)
                return next(new UnauthorizedAccessError("401", {
                    message: 'Invalid User'
                }));

            res.json(Utils.buildRes(true, null, {
                games: user.games.map(function(obj) {
                    return obj.asJson();
                })
            }));
        });

    // Game.find({}, function(err, games) {
    //     res.json(games.map(function(obj) {
    //         return obj.asJson();
    //     }));
    // });
}

module.exports.getGame = function(req, res, next) {
    var bundle = req.query.gameBundle;
    var platform = req.query.platform;

    data = {};
    if (platform == 'iOS')
        data.iosBundleIdentifier = bundle;
    if (platform == 'Android')
        data.androidBundleIdentifier = bundle;

    Game.findOne(data)
        .exec(function(err, game) {
            if (err || !game)
                return next(new UnauthorizedAccessError("401", {
                    message: 'Invalid Game'
                }));

            res.json(Utils.buildRes(true, null, {
                game: game.asJson()
            }));
        });
}