var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Student Model
 * =============
 */

var Student = new keystone.List('Student', {
    track: true,
    defaultSort: '-createdAt'
});

Student.add({
    name: { type: String, required: true },
    password: { type: Number, initial: true, required: true },
    deviceId: { type: String },
    // school: { type: Types.Relationship, ref: 'School' },
    // avatar: { type: Types.Relationship, ref: 'StudentAvatar' },
    avatar: { type: Number, initial: true, required: true },
    userId: { type: String, initial: true, required: true },

    games: { type: Types.Relationship, ref: 'Game', many: true },

});

Student.schema.methods.asJson = function() {
    return {
        student_id: this._id,
        user_id: this.userId,
        name: this.name,
        password: this.password,
        avatar: this.avatar
    }
};

/**
 * Registration
 */

Student.defaultColumns = 'name, school, games';
Student.register();
