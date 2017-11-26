const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const projectSchema = new Schema({
  username: { type: String, require: true},
 	project: { type: String, uppercase: true, require: true, unique: true }, //
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, lowercase: true, require: true, default: 'mongodb,express,vuejs,nodejs' },
  public: { type: Boolean, required: true },
  img: { type: String },
  created: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
