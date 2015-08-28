// get an instance of mongoose and mongoose.Schema
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var SchoolSchema = new Schema({
    schoolName: {
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

SchoolSchema.methods.asJson = function() {
    return {
        school_id: this._id,
        school_name: this.schoolName
    }
};

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('School', SchoolSchema);

