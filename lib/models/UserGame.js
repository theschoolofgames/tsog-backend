var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var UserGameSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        require: true
    },
    gameId: {
        type: String,
        unique: true,
        require: true  
    },
    level: Number,
    star: Number,
    timeTaken: Number
}, {
    toObject: {
        virtuals: true
    }, toJSON: {
        virtuals: true
    }
});

UserGameSchema.methods.asJson = function() {
    return {
        level: this.level,
        star: this.star,
        timeTaken: this.timeTaken
    }
};

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('UserGame', UserGameSchema);