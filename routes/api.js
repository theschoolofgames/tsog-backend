var express = require('express');
var router = express.Router();

var User   = require('../app/models/user');

/* GET home page. */
router.get('/setup', function(req, res) {
    // create a sample user
    var nick = new User({ 
        email: 'nick@example.com',
        name: 'Nick Cerminara', 
        encrypted_password: 'password',
    
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

module.exports = router;
