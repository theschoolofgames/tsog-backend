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
                    message: 'Invalid username or password'
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