var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('TSOG');
});

module.exports = router;
