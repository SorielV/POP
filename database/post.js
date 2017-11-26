const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const postSchema = new Schema({
    username: { type: String, required: true},
    project: { type: String, required: true }, //Relacionado
    title: { type: String, required: true },
    content : { type: String, required: true },
    date : { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;