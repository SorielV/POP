const User = require('../database/user'),
	InfoUser = require('../database/infouser');


const getProfile = (req, res) => {
	InfoUser.findOne({
		username: req.user.username
	})
	.then((infoUser, err) => {
		if(err || !infoUser) {
			res.status(err ? 500 : 400).end()
		}
		else {
			res.json(infoUser).end()
		}
	})
};

const updateProfile = (req, res) => {
	InfoUser.findOne({
		username: req.user.username
	})
	.then((infoUser, err) => {
		if(err || !infoUser) {
			res.status(err ? 500 : 400).end()
		}
		else {
			console.log(req.body)
			infoUser.description = req.body.description ? req.body.description : infoUser.description
    	infoUser.age = req.body.age ? req.body.age : infoUser.age
    	infoUser.rol = req.body.rol ? req.body.rol : infoUser.rol
    	infoUser.tag = req.body.tag ? req.body.tag : infoUser.tag
    	infoUser.save()
    	.then((infoUser, err) => {
	    	if(err || !infoUser) {
					res.status(err ? 500 : 400).end()
				} else {
					res.json(infoUser).end()
				}
			})
		}
	})
	.catch(err => {
		console.log(err)
		res.status(500).end()
	})
};

const deleteUser = (req, res) => {
	/*InfoUser.findOne({
		username: req.user.username
	})
	.then((infoUser, err) => {
		if(err || !infoUser) {
			res.status(err ? 500 : 400).end()
		}
		else {

		}
	})*/
};


module.exports = {
	getProfile,
	updateProfile,
	deleteUser
}