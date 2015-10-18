var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Student Model
 * =============
 */

var Student = new keystone.List('Student');

Student.add({
    name: { type: String, required: true },
    password: { type: Number, initial: true, required: true },
    deviceId: { type: String },
    school: { type: Types.Relationship, ref: 'School' },
    avatar: { type: Types.Relationship, ref: 'StudentAvatar' },
    games: { type: Types.Relationship, ref: 'Game', many: true }
});

Student.schema.methods.asJson = function() {
    return {
        user_id: this._id,
        name: this.name,
        password: this.password,
        avatar: this.avatar.asJson()
    }
};

/**
 * Registration
 */

Student.defaultColumns = 'name';
Student.register();
