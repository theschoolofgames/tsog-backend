var _           = require("lodash");

var UserAvatar  = require('../models/UserAvatar');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

module.exports.avatar_customization = function(req, res, next) {

    var sex = req.body.avatar.sex;
    var skinId = req.body.avatar.skin_id;
    var hairId = req.body.avatar.hair_id;
    var eyeId = req.body.avatar.eye_id;
    var mouthId = req.body.avatar.mouth_id;
    var noseId = req.body.avatar.nose_id;

    if (!_.isNumber(sex) ||
        !_.isNumber(skinId) ||
        !_.isNumber(hairId) ||
        !_.isNumber(eyeId) ||
        !_.isNumber(mouthId) ||
        !_.isNumber(noseId)) {
        return next(new UnauthorizedAccessError("401", {
            message: 'Invalid params'
        }));
    }

    UserAvatar.findOne( { _id: req.user.avatarId }, function(err, userAvatar) {
        if (err)
            return next(new Error(err));

        userAvatar.sex = sex;
        userAvatar.skinId = skinId;
        userAvatar.hairId = hairId;
        userAvatar.eyeId = eyeId;
        userAvatar.mouthId = mouthId;
        userAvatar.noseId = noseId

        userAvatar.save(function(err) {
            if (err)
                return next(new Error(err));

            res.json(Utils.buildRes(true));
        })
    });
}