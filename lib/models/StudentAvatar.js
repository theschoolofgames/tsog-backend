var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * StudentAvatar Model
 * ===================
 */

var StudentAvatar = new keystone.List('StudentAvatar');

StudentAvatar.add({
    sex: Number,
    skinId: Number,
    hairId: Number,
    eyeId: Number,
    mouthId: Number,
    noseId: Number
});

StudentAvatar.schema.methods.asJson = function() {
    return {
        sex: this.sex,
        skin_id: this.skinId,
        hair_id: this.hairId,
        eye_id: this.eyeId,
        mouth_id: this.mouthId,
        nose_id: this.noseId
    }
};


/**
 * Registration
 */

StudentAvatar.defaultColumns = 'sex, skinId, hairId, eyeId, mouthId, noseId';
StudentAvatar.register();
