var keystone    = require('keystone');

var Student     = keystone.list('Student');
var Game        = keystone.list('Game');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

var UnauthorizedAccessError = require('../errors/UnauthorizedAccessError');

module.exports.getGames = function(req, res, next) {
    var userId = req.query.user_id;

    Student.model.findOne()
        .where('_id', userId )
        .populate('games')
        .exec(function(err, student) {
            if (err || !student)
                return next(new UnauthorizedAccessError("401", {
                    message: 'Invalid Student'
                }));

            res.json(Utils.buildRes(true, null, {
                games: student.games.map(function(obj) {
                    return obj.asJson();
                })
            }));
        });
}