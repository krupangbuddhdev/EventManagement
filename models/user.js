var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: Number,
	username: String,
	email: String,
	role: String,
	enroll: Number,
	college: String,
	mobile: Number,
	password: String,
	passwordConf: String
}),
User = mongoose.model('User', userSchema);

module.exports = User;