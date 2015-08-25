// get an instance of mongoose and mongoose.Schema
var mongoose        = require('mongoose');
var passwordHash    = require('password-hash');
var Schema          = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: true
    },
    encrypted_password: {
        type: String,
        require: true
    },
    device_id: String
}, {
    toObject: {
        virtuals: true
    }, toJSON: {
        virtuals: true
    }
});

// UserSchema.pre('save', function (next) {
//     var user = this;
//     if (this.isModified('encrypted_password') || this.isNew) {
//         user.encrypted_password = passwordHash.generate(password);
//         next();
//     } else {
//         return next();
//     }
// });

// UserSchema.methods.comparePassword = function (passw, cb) {
//     return passwordHash.verify(passw, user.encrypted_password);
// };

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', UserSchema);

