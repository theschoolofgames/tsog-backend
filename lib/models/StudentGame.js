var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * StudentGame Model
 * =================
 */

var StudentGame = new keystone.List('StudentGame');

StudentGame.add({
    userId: { type: String, require: true, index: true },
    gameId: { type: String, require: true, index: true },
    data: String
});

/**
 * Registration
 */

StudentGame.defaultColumns = 'userId, gameId';
StudentGame.register();
