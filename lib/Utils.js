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

module.exports.shuffle = function(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}