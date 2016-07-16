var merge   = require('merge');
var jwt     = require('jsonwebtoken')

var UnauthorizedAccessError = require('./errors/UnauthorizedAccessError');

var User    = require('keystone').list('User');

var SECRET = process.env.JWT_SECRET;

module.exports.authenticate = function(req, res, next) {
    var token = req.body.access_token || req.query.access_token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, SECRET, function(err, decoded) {      
            if (err) {
                next(new UnauthorizedAccessError({ 
                    message: 'Failed to authenticate token.' 
                }));
            } else {
                User.model.findOne().where('_id', decoded.user_id).exec(function(err, user) {
                    if (err) next(new UnauthorizedAccessError({ message: 'An error has occurred - ' + err }));
                    if (!user) next(new UnauthorizedAccessError({ message: 'An error has occurred - No User Found' }));
                    
                    req.user = user;
                    next();
                });
            }
        });
    } else {
        // if there is no token
        // return an error
        next(new UnauthorizedAccessError({ message: 'No token provided.' }));
    }
};

module.exports.createUserToken = function(userId) {
    return jwt.sign( {user_id: userId}, SECRET);
}