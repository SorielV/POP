const User = require('../database/user');

const getUserByUsername = (_username) => {
	User.findOne({ username : _username })
		.then( (user, err) => {
			return (!error) ? user : null;
		});
};

const getUserByEmail = (_email) => {
	User.findOne( email: _email )
		.then( (user, error) => {
			return (!error) ? user : null;
 		});
};

const getUserInfo = (req, res, username) {
	
}

/*const updateUserId = (_id,) => {
	User.findOne( _id : _id).then( (user, err) => {
		if(!erro).
	});

};*/

