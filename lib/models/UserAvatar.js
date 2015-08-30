var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var UserAvatarSchema = new Schema({
    sex: String,
    skinId: String,
    hairId: String,
    eyeId: String,
    mouthId: String,
    noseId: String
}, {
    toObject: {
        virtuals: true
    }, toJSON: {
        virtuals: true
    }
});

UserAvatarSchema.methods.asJson = function() {
    return {
        sex: this.sex,
        skin_id: this.skinId,
        hair_id: this.hairId,
        eye_id: this.eyeId,
        mouth_id: this.mouthId,
        nose_id: this.noseId
    }
};

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('UserAvatar', UserAvatarSchema);