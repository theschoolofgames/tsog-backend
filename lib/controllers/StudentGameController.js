var keystone    = require('keystone');

var Student     = keystone.list('Student');
var Game        = keystone.list('Game');
var StudentGame = keystone.list('StudentGame');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

var UnauthorizedAccessError = require('../errors/UnauthorizedAccessError');

module.exports.gameProgress = function(req, res, next) {
    var userId = req.body.user_id;
    var gameId = req.body.game_id;
    var data = req.body.data;

    Student.model.findOne()
        .where('_id', userId)
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

            var newStudentGame = new StudentGame.model({
                userId: userId,
                gameId: gameId,
                data: JSON.stringify(data)
            });

            newStudentGame.save(function(err) {
                if (err) next(new Error(err));

                res.json(Utils.buildRes(true));
            })
        });

    // Game.find({}, function(err, games) {
    //     res.json(games.map(function(obj) {
    //         return obj.asJson();
    //     }));
    // });
}