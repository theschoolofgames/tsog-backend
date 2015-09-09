var _               = require("lodash");
var jwt             = require('jsonwebtoken');
var passwordHash    = require('password-hash');
var merge           = require('merge');

var User        = require('../models/User');
var UserAvatar  = require('../models/UserAvatar');
var Constants   = require('../Constants');
var Utils       = require('../Utils');
var Token       = require('../Token');

var UnauthorizedAccessError = require('../errors/UnauthorizedAccessError');

// module.exports.login = function(req, res, next) {
//     var username = req.body.user_name.toLowerCase();
//     var password = req.body.user_password;
//     var device_id = req.body.device_id;

//     if (_.isEmpty(username) || _.isEmpty(password)) {
//         return next(new UnauthorizedAccessError("401", {
//             message: 'Invalid username or password'
//         }));
//     }
    
//     User.findOne({ username: username }, function(err, user) {
//         if (err || !user) {
//             return next(new UnauthorizedAccessError("401", {
//                 message: 'Invalid username or password'
//             }));
//         }

//         if (user.comparePassword(password)) {
//             Token.create(user, req, res, next, function(data) {
//                 res.json(Utils.buildRes(true, null, data));
//             });
//         }
//         else {
//             return next(new UnauthorizedAccessError("401", {
//                 message: 'Invalid username or password'
//             }));
//         }
//     });

// };

// module.exports.register = function(req, res, next) {
//     var username = req.body.user_name.toLowerCase();
//     var password = req.body.user_password;
//     var device_id = req.body.device_id;

//     // Avatar
//     var sex = req.body.avatar.sex;
//     var skinId = req.body.avatar.skin_id;
//     var hairId = req.body.avatar.hair_id;
//     var eyeId = req.body.avatar.eye_id;
//     var mouthId = req.body.avatar.mouth_id;
//     var noseId = req.body.avatar.nose_id;

//     if (_.isEmpty(username) || 
//         _.isEmpty(password) ||
//         !_.isNumber(sex) ||
//         !_.isNumber(skinId) ||
//         !_.isNumber(hairId) ||
//         !_.isNumber(eyeId) ||
//         !_.isNumber(mouthId) ||
//         !_.isNumber(noseId)) {
//         return next(new UnauthorizedAccessError("401", {
//             message: 'Invalid params'
//         }));
//     }

//     User.findOne({ username: username }, '', function(err, user) {
//         if (err)
//             return next(new Error(err));

//         if (user) {
//             res.json(Utils.buildRes(false, "Register failed. User exist", null));
//         } else {
//             var newUser = new User({ 
//                 username: username,
//                 password: password,
//                 deviceId: device_id
//             });

//             var newAvatar = new UserAvatar({
//                 sex: sex,
//                 skinId: skinId,
//                 hairId: hairId,
//                 eyeId: eyeId,
//                 mouthId: mouthId,
//                 noseId: noseId
//             });

//             newAvatar.save(function(err) {
//                 if (err) 
//                     return next(new Error(err));

//                 newUser.avatarId = newAvatar._id;
//                 newUser.save(function(err) {
//                     if (err) 
//                         return next(new Error(err));

//                     Token.create(newUser, req, res, next, function(data) {
//                         res.json(Utils.buildRes(true, null, data));
//                     });
//                 });
//             });
//         }
//     })
// };

// module.exports.logout = function(req, res, next) {
//     if (Token.expire(req)) {
//         delete req.user;
//         return res.json(Utils.buildRes(true, "User has been successfully logged out", null));
//     } else {
//         return next(new UnauthorizedAccessError("401"));
//     }
// };

// module.exports.changePassword = function(req, res, next) {
//     var newPass = req.body.new_password;

//     req.user.password = newPass;

//     req.user.save(function(err) {
//         if (err) return next(new Error(err));

//         res.json(Utils.buildRes(true));
//     });
// }

// module.exports.userInfo = function(req, res, next) {
//     UserAvatar.findOne({ _id: req.user.avatarId }, function(err, userAvatar) {
//         res.json(Utils.buildRes(true, null, {
//             user: merge(req.user.asJson(), { avatar: userAvatar.asJson() })
//         }));
//     });
// }



