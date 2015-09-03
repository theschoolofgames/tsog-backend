var express         = require('express');
var router          = express.Router();
var jwt             = require('jsonwebtoken');
var passwordHash    = require('password-hash');

var Utils       = require('../lib/Utils');
var Token       = require('../lib/Token');
var User        = require('../lib/models/User');

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

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/logout', Token.verify, UserController.logout);
router.post('/change_password', Token.verify, UserController.changePassword);
router.get('/me', Token.verify, UserController.userInfo);

router.get('/schools', SchoolController.getSchools);
router.post('/select_school', Token.verify, SchoolController.selectSchool);

router.get('/games', GameController.getGames);

router.get('/blob', Token.verify, BlobController.getBlob);
router.post('/blob', Token.verify, BlobController.postBlob);

router.post('/avatar_customization', Token.verify, UserAvatarController.avatar_customization);

module.exports = router;
