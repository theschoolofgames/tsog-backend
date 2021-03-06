var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Game Model
 * ==========
 */

var Game = new keystone.List('Game');

Game.add({
    name: { type: String, required: true, index: true },
    androidScheme: { type: String, required: true, initial: true },
    iosScheme: { type: String, initial: true, required: true },
    config: String,
    iconURL: Types.Url
});

// Provide access to Keystone
Game.schema.methods.asJson = function() {
    return {
        game_id: this._id,
        game_name: this.name,
        icon: this.iconURL,
        android_bundle: this.androidScheme,
        ios_bundle: this.iosScheme,
        config: this.config,
    }
};


/**
 * Registration
 */

Game.defaultColumns = 'name, androidScheme, iosScheme';
Game.register();
