var Game        = require('../models/Game');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

module.exports.getGames = function(req, res, next) {
    Game.find({}, function(err, games) {
        res.json(games.map(function(obj) {
            return obj.asJson();
        }));
    });
}