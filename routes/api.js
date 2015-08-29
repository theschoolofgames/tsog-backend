var express         = require('express');
var router          = express.Router();
var jwt             = require('jsonwebtoken');
var passwordHash    = require('password-hash');

var Utils       = require('../lib/Utils');
var User        = require('../lib/models/User');

var UserController      = require('../lib/controllers/UserController');
var SchoolController    = require('../lib/controllers/SchoolController');
var GameController      = require('../lib/controllers/GameController');
var BlobController      = require('../lib/controllers/BlobController');

router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/logout', Utils.verify, UserController.logout);
router.get('/me', Utils.verify, UserController.userInfo);

router.get('/schools', SchoolController.getSchools);
router.post('/select_school', Utils.verify, SchoolController.selectSchool);

router.get('/games', GameController.getGames);

router.get('/blob', Utils.verify, BlobController.getBlob);
router.post('/blob', Utils.verify, BlobController.postBlob);

module.exports = router;
