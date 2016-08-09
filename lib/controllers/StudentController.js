var keystone    = require('keystone');

var School     = keystone.list('School');
var Student     = keystone.list('Student');
var Game        = keystone.list('Game');
var User        = keystone.list('User');
var Constants   = require('../Constants');
var Utils       = require('../Utils');

var BadRequestError = require('../errors/BadRequestError');

module.exports.createStudent = function(req, res, next) {
    var name = req.body.name;
    // var schoolId = req.body.schoolId;
    var userId = req.body.userId;
    var avatar = req.body.avatar;
    var password = req.body.password;

    // console.log("createStudent: '%s', '%s'", name, schoolId);
    console.log("createStudent: '%s'", name);

    User.model
        .findOne()
        .where('_id', userId).exec(function(err, user) {
            if (user) {
                Game.model.find().exec(function(err1, games) {
                    var newStudent = new Student.model({
                        name: name,
                        userId: userId,
                        avatar: avatar,
                        password: password
                    });

                    // add game
                    newStudent.games = [games[0]]

                    newStudent.save(function(err) {
                        if (err) return next(new Error(err));

                        res.json(newStudent.asJson());
                    })
                });
            } else {
                return next(new BadRequestError({
                    message: 'User not found'
                }));
            }
        })
}