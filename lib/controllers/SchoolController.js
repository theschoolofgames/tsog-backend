var School      = require('../models/School');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

module.exports.getSchools = function(req, res, next) {
    School.find({}, function(err, schools) {
        res.json(schools.map(function(obj) {
            return obj.asJson();
        }));
    });
}