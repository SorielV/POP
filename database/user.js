const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');
    Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    /*age: { type: Number, required: true },
    name: { type: String, default: "Anonymous"},
    rol: { type: String, default : '?'},
    tags: { type: String, default : '?'},*/
    date: { type: Date, default: Date.now }
});
//UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema);
module.exports = User;

