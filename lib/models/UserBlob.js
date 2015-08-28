var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var UserBlobSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        require: true
    },
    blob: String
}, {
    toObject: {
        virtuals: true
    }, toJSON: {
        virtuals: true
    }
});

UserBlobSchema.methods.asJson = function() {
    return {
        blob: this.blob
    }
};

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('UserBlob', UserBlobSchema);