var _           = require("lodash");
var keystone    = require('keystone');

var Student     = keystone.list('Student');
var School      = keystone.list('School');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

var UnauthorizedAccessError = require('../errors/UnauthorizedAccessError');

module.exports.getSchools = function(req, res, next) {
    School.model
        .find()
        .exec(function(err, schools) {
            res.json(schools.map(function(obj) {
                return obj.asJson();
            }));
        });
}

module.exports.getAccounts = function(req, res, next) {
    var schoolId = req.query.school_id;

    School.model
        .findOne()
        .where('_id', schoolId)
        .exec(function(err, school) {
            if (err || !school) {
                return next(new UnauthorizedAccessError("401", {
                    message: 'Invalid school id.'
                }));
            }

            Student.model
                .find()
                .where('school', school._id)
                .populate('avatar')
                .exec(function(err, students) {
                    if (err)
                        return next(new Error(err));

                    res.json(Utils.buildRes(true, null, {
                        accounts: students.map(function(obj) {
                            return obj.asJson();
                        })
                    }));
                });
    });
}