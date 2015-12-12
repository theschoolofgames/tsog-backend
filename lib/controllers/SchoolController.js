var _           = require("lodash");
var keystone    = require('keystone');

var Student     = keystone.list('Student');
var School      = keystone.list('School');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

var BadRequestError = require('../errors/BadRequestError');

module.exports.getSchools = function(req, res, next) {
    School.model
        .find()
        .sort('-updatedAt')
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
                return next(new BadRequestError("400", {
                    message: 'Invalid school id'
                }));
            }

            Student.model
                .find()
                .where('school', school._id)
                .sort('-updatedAt')
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

module.exports.createSchool = function(req, res, next) {
    var name = req.body.name;

    School.model
        .findOne()
        .where('name', name).exec(function(err, school) {
            if (school) {
                return next(new BadRequestError("400", {
                    message: 'A school with this name already existed'
                }));
            } else {
                var newSchool = new School.model({
                    name: name
                });

                newSchool.save(function(err) {
                    if (err) return next(new Error(err));

                    res.json(newSchool.asJson());
                })
            }
        })
}