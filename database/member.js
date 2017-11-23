const   mongoose = require('mongoose'),
        Schema = mongoose.Schema;

//Relationship with Group

const memberSchema = new Schema({
    username: { type: String, require: true },
    project: { type: String, uppercase: true, require: true }, //Equivalent of group relationship
    level: { type: Number, require: true, default: 0},
    point: { type: Number, require: true, default: 0},
    date:  { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
