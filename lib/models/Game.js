var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var GameSchema = new Schema({
    gameName: {
        type: String,
        unique: true,
        require: true
    },
    androidBundleIdentifier: {
        type: String,
        unique: true,
        require: true
    },
    iosBundleIdentifier: {
        type: String,
        unique: true,
        require: true
    }
}, {
    toObject: {
        virtuals: true
    }, toJSON: {
        virtuals: true
    }
});

GameSchema.methods.asJson = function() {
    return {
        game_id: this._id,
        game_name: this.gameName,
        android_bundle: this.androidBundleIdentifier,
        ios_bundle: this.iosBundleIdentifier
    }
};

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Game', GameSchema);
