var UserBlob    = require('../models/UserBlob');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

module.exports.getBlob = function(req, res, next) {
    UserBlob.findOne({ userId: req.user._id }, function(err, userBlob) {
        if (err) throw err;

        var blob = userBlob ? userBlob.blob : "";
        res.json(Utils.buildRes(true, null, { blob: blob }));
    });
}