var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: String,
    provider: String,
    google: Schema.Types.Mixed
});

module.exports = mongoose.model('User', UserSchema);