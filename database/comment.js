const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const commentSchema = new Schema({
	username: { type: String, required: true},
	project : { type: String, required: true},
	post: { type: String, required: true }, //Realacionado
	content : { type: String, required: true }, 
	date : { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;