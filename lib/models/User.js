// get an instance of mongoose and mongoose.Schema
var mongoose        = require('mongoose');
var passwordHash    = require('password-hash');
var Schema          = mongoose.Schema;

var UserSchema = new Schema({
    // username: {
    //     type: String,
    //     unique: true,
    //     require: true
    // },
    password: {
        type: Number,
        require: true
    },
    deviceId: String,
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School'
    },
    avatar: {
        type: Schema.Types.ObjectId,
        ref: 'UserAvatar'
    }
}, {
    toObject: {
        virtuals: true
    }, toJSON: {
        virtuals: true
    }
});

// UserSchema.pre('save', function (next) {
//     var user = this;
//     if (this.isModified('password') || this.isNew) {
//         user.password = passwordHash.generate(user.password);
//         next();
//     } else {
//         return next();
//     }
// });

// UserSchema.methods.comparePassword = function (passw) {
//     return passwordHash.verify(passw, this.password);
// };

UserSchema.methods.asJson = function() {
    return {
        user_id: this._id,
        password: this.password,
        avatar: this.avatar.asJson()
    }
};

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', UserSchema);

