var jwt    = require('jsonwebtoken');
var merge = require('merge');

module.exports = {
    authenticate: function(token, cb) {
        jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
            if (err) {
                cb && cb(err, null);
                return;
            }

            // callback have to handle error
            cb && cb(null, decoded);
        });
    },

    buildRes: function(succeed, message, data) {
        var obj = {
            succeed: succeed,
        };

        if (!succeed)
            obj.message = message;
        if (data) 
            obj = merge(obj, data);

        return obj;
    }
}