var _           = require("lodash");

var School      = require('../models/School');
var User        = require('../models/User');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

var UnauthorizedAccessError = require('../errors/UnauthorizedAccessError');

module.exports.getSchools = function(req, res, next) {
    School.find({}, function(err, schools) {
        res.json(schools.map(function(obj) {
            return obj.asJson();
        }));
    });
}

// module.exports.selectSchool = function(req, res, next) {
//     var schoolId = req.body.school_id;
//     var user = req.user;

//     if (_.isEmpty(schoolId)) {
//         return next(new UnauthorizedAccessError("401", {
//             message: 'Invalid school id.'
//         }));
//     }

//     School.findOne({ _id: schoolId }, function(err, school) {
//         if (err || !school) {
//             return next(new UnauthorizedAccessError("401", {
//                 message: 'Invalid school id.'
//             }));
//         }

//         user.schoolId = schoolId;
//         user.save(function(err) {
//             if (err) 
//                 return next(new Error(err));

//             res.json(Utils.buildRes(true, null, null));
//         });
//     });
// }

module.exports.getAccounts = function(req, res, next) {
    var schoolId = req.query.school_id;

    School.findOne({ _id: schoolId }, function(err, school) {
        if (err || !school) {
            return next(new UnauthorizedAccessError("401", {
                message: 'Invalid school id.'
            }));
        }

        User.find({ school: school })
            .populate('avatar')
            .exec(function(err, users) {
                if (err)
                    return next(new Error(err));

                res.json(Utils.buildRes(true, null, {
                    accounts: users.map(function(obj) {
                        return obj.asJson();
                    })
                }));
            });
    });
}