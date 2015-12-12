var keystone        = require('keystone');
var faker           = require('faker');

var Student         = keystone.list('Student');
var StudentAvatar   = keystone.list('StudentAvatar');
var School          = keystone.list('School');
var Game            = keystone.list('Game');

School.model.find().exec(function(err, schools) {
    Game.model.find().exec(function(err1, games) {
        for (var i = 0; i < 5; i++) {
            var newAvatar = Math.floor(Math.random()*10) + 1
            var schoolIndex = Math.floor(Math.random() * schools.length);
            var name = faker.name.firstName();
            var newStudent = new Student.model({ 
                name: name,
                password: Math.floor(Math.random() * 10 + 1),
                school: schools[schoolIndex],
                avatar: newAvatar,
                games: games[0]
            });
            newStudent.save(function(err3) {});

            console.log("New student: %s, %s", name, schools[schoolIndex].name);
        }
    });
});

exports.create = {
}