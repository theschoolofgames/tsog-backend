var BadRequestError = require('../errors/BadRequestError');
var merge           = require('merge');

var keystone        = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
    name: { type: String, required: true, index: true },
    password: { type: Types.Password, initial: true, required: true },
    token: String,
    fullAccess: { type: Boolean, initial: false, default: false }
});

// Provide access to Keystone
User.schema.methods.asJson = function(obj) {
    return merge({
        user_id: this._id,
        user_name: this.name,
        full_access: this.fullAccess
    }, obj);
};

// Validation
User.schema.pre('validate', function(next) {
    var usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (this.name.length < 3)
        next(new BadRequestError({ "message": "Username is too short. It must be more than 3 characters." }))
    else if (!this.name.match(usernameRegex))
        next(new BadRequestError({ "message": 'Username can only contains letters, numbers, dots and underscores.'}));
    else
        next();
});


/**
 * Registration
 */

User.defaultColumns = 'name';
User.register();
