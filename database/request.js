const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const requestSchema = new Schema({
	//Agregar o Amistad
	type : { type: Number, required: false, min:1, max:2 ,default: 1},
	/*
		@type {
			1: peticion
			2: invitacion
		}		
	*/
	from : { type: String, required: true },
	to: { type: String, required: true },
	response: {type: Number, required: true, min:-1, max:1, default: -1},
	content : { type: String, required: false },  
	date : { type: Date, default: Date.now }
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;