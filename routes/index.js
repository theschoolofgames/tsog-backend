var express = require('express');
var router = express.Router();

var jwt    = require('jsonwebtoken');
var config = require('../config');

/* GET home page. */
router.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('TSOG');
});

module.exports = router;