var express         = require('express');
var router          = express.Router();
var jwt             = require('jsonwebtoken');
var passwordHash    = require('password-hash');
var faker           = require('faker');

var Utils       = require('../lib/Utils');
var Token       = require('../lib/Token');
var User        = require('../lib/models/User');
var School      = require('../lib/models/School');
var Game        = require('../lib/models/Game');
var UserAvatar  = require('../lib/models/UserAvatar');

var UserController          = require('../lib/controllers/UserController');
var SchoolController        = require('../lib/controllers/SchoolController');
var GameController          = require('../lib/controllers/GameController');
var BlobController          = require('../lib/controllers/BlobController');
var UserAvatarController    = require('../lib/controllers/UserAvatarController');

router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

router.get('/seed', function(req, res) {
    School.find({}, function(err, schools) {
        Game.find({}, function(err1, games) {
            for (var i = 0; i < 100; i++) {
                var newAvatar = new UserAvatar({
                    sex: Math.floor(Math.random()*2),
                    skinId: Math.floor(Math.random()*5),
                    hairId: Math.floor(Math.random()*5),
                    eyeId: Math.floor(Math.random()*5),
                    mouthId: Math.floor(Math.random()*5),
                    noseId: Math.floor(Math.random()*5)
                }); 
                newAvatar.save(function(err2) {});

                var newUser = new User({ 
                    username: faker.name.firstName(),
                    password: Math.floor(Math.random() * 5 + 1),
                    school: schools[Math.floor(Math.random() * schools.length)],
                    avatar: newAvatar,
                    games: Utils.shuffle(games).slice(0, 3)
                });
                newUser.save(function(err3) {});
            }

            res.json("OK");
        });
    });
});

// router.post('/login', UserController.login);
// router.post('/register', UserController.register);
// router.post('/logout', Token.verify, UserController.logout);
// router.post('/change_password', Token.verify, UserController.changePassword);
// router.get('/me', UserController.userInfo);

router.get('/schools', SchoolController.getSchools);
router.get('/accounts', SchoolController.getAccounts);
// router.post('/select_school', Token.verify, SchoolController.selectSchool);

router.get('/games', GameController.getGames);

router.get('/blob', Token.verify, BlobController.getBlob);
router.post('/blob', Token.verify, BlobController.postBlob);

router.post('/avatar_customization', Token.verify, UserAvatarController.avatar_customization);

module.exports = router;
