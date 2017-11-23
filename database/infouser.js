const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');
    Schema = mongoose.Schema;

const InfoUserSchema = new Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default : ''},
    age: { type: Number },
    rol: { type: String, default : ''},
    tag: { type: String, default : ''},
    date: { type: Date, default: Date.now }
});
//UserSchema.plugin(passportLocalMongoose);
const InfoUser = mongoose.model('InfoUser', InfoUserSchema);
module.exports = InfoUser;

