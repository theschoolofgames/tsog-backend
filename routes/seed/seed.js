var keystone        = require('keystone');
var faker           = require('faker');

var Student         = keystone.list('Student');
var StudentAvatar   = keystone.list('StudentAvatar');
var School          = keystone.list('School');
var Game            = keystone.list('Game');

var Utils           = require('../../lib/Utils');

exports = module.exports = function(req, res) {
    School.model.find().exec(function(err, schools) {
        Game.model.find().exec(function(err1, games) {
            for (var i = 0; i < 100; i++) {
                var newAvatar = new StudentAvatar.model({
                    sex: Math.floor(Math.random()*2),
                    skinId: Math.floor(Math.random()*5),
                    hairId: Math.floor(Math.random()*5),
                    eyeId: Math.floor(Math.random()*5),
                    mouthId: Math.floor(Math.random()*5),
                    noseId: Math.floor(Math.random()*5)
                }); 
                newAvatar.save(function(err2) {});

                var newStudent = new Student.model({ 
                    name: faker.name.firstName(),
                    password: Math.floor(Math.random() * 5 + 1),
                    school: schools[Math.floor(Math.random() * schools.length)],
                    avatar: newAvatar,
                    games: Utils.shuffle(games).slice(0, 3)
                });
                newStudent.save(function(err3) {});
            }

            res.json("OK");
        });
    });
};