var express         = require('express');
var router          = express.Router();
var jwt             = require('jsonwebtoken');
var passwordHash    = require('password-hash');

var Utils       = require('../lib/Utils');
var User        = require('../lib/models/User');

var UserController = require('../lib/controllers/UserController');

// router.get('/users', isAuthenticated);
router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/logout', Utils.verify, UserController.logout);
router.get('/me', Utils.verify, UserController.userInfo);

module.exports = router;
