var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * School Model
 * ==========
 */

var School = new keystone.List('School');

School.add({
    name: { type: String, required: true, index: true }
});

// Provide access to Keystone
School.schema.methods.asJson = function() {
    return {
        school_id: this._id,
        school_name: this.name
    }
};


/**
 * Registration
 */

School.defaultColumns = 'name';
School.register();
