var merge   = require('merge');

module.exports.buildRes = function(succeed, message, data) {
    var obj = {
        succeed: succeed,
    };

    if (message)
        obj.message = message;
    if (data) 
        obj = merge(obj, data);

    return obj;
};
