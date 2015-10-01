var User        = require('../models/User');
var Game        = require('../models/Game');
var UserGame    = require('../models/UserGame');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

var UnauthorizedAccessError = require('../errors/UnauthorizedAccessError');

module.exports.gameProgress = function(req, res, next) {
    var userId = req.body.user_id;
    var gameId = req.body.game_id;
    var level = req.body.level;
    var star = req.body.star;
    var timeTaken = req.body.time_taken;

    UserGame.findOne( { userId: userId, gameId: gameId, level: level } )
        .exec(function(err, userGame) {
            if (err) throw err;

            if (userGame)
                return next(new UnauthorizedAccessError("401", {
                    message: 'Game Data Exist'
                }));

            User.findOne({ _id: userId })
                .populate('games')
                .exec(function(err, user) {
                    if (err || !user)
                        return next(new UnauthorizedAccessError("401", {
                            message: 'Invalid User'
                        }));

                    var gameFound = false;
                    for (var i = 0; i < user.games.length; i++) {
                        if (user.games[i]._id == gameId)
                            gameFound = true;
                    }

                    if (!gameFound)
                        return next(new UnauthorizedAccessError("401", {
                            message: 'Invalid Game'
                        }));

                    var newUserGame = new UserGame({
                        userId: userId,
                        gameId: gameId,
                        level: level,
                        star: star,
                        timeTaken: timeTaken
                    });

                    newUserGame.save(function(err) {
                        if (err) throw err;

                        res.json(Utils.buildRes(true));
                    })
                });
        });

    // Game.find({}, function(err, games) {
    //     res.json(games.map(function(obj) {
    //         return obj.asJson();
    //     }));
    // });
}