const Request = require('../database/request'),
	User = require('../database/user'),
	Project = require('../database/project'),
	Member = require('../database/member');

///project/:project/:username
const sendInvitation = (req, res) => {
	let request = new Request({
		type : 1,
		from : req.project.project,
		to : req.username,
		content : req.params.content ? req.params.content : ''
	});

	request.save()
	.then((user, err) => {
		if(err || !user) { 
  		res.status(err ? 500 : 400).end()
		} else {
			res.status(200).end()
		}
	})
	.catch((err) => {
		res.status(400).end()
	})
};

const sendJoinRequest = (req, res) => { 
	let request = new Request({
		type : 2,
		from : req.user.username,
		to : req.project.project,
		content : req.params.content ? req.params.content : ''
	});

	request.save()
	.then((user, err) => {
		if(err || !user) { 
  		res.status(err ? 500 : 400).end()
		} else {
			res.status(200).end()
		}
	})
	.catch((err) => {
		res.status(400).end()
	})	
}

const sendFriendRequest = (req, res) => {
	if(req.params.username)	{
		User.findOne({ username: req.params.username })
		.then((user,err) => {
			let request = new Request({
				type : 2,
				from : req.user.username,
				to : req.user.username,
				content : req.params.content ? req.params.content : ''
			});

			request.save()
			.then((user, err) => {
    		if(err || !user) { 
      		res.status(err ? 500 : 400).end()
				} else {
					res.status(200).end()
				}
			})
		}).catch((err) => {
			res.status(400).end()
		})
	}
};

const setProject = (req, res, next, project)=> {
	Project.findOne({ 
		project : project
	})
	.then((project, err) => {
		if(err || !project) { 
  		res.status(err ? 500 : 400).end()
		} else {
			req.project = project
			next()
		}
	}).catch((err) => {
		res.status(400).end()
	})
};

const setUsername = (req, res, next, username) => {
	User.findOne({ 
		username 
	}) 
	.then((user,err) => {
		if(err || !user) { 
  		res.status(err ? 500 : 400).end()
		} else {
			req.username = user.username
			next()
		}
	}).catch((err) => {
		res.status(400).end()
	})
};

const getProjectRequest = (req, res) => {
	Request.find({
		to : req.params.project
	})
	.then((request, err) => {
		if(err || !request) { 
  		res.status(err ? 500 : 400).end()
  	} else {
  		res.json(request)
  	}
	})
};

const getUserRequest = (req, res) => {
	Request.find({ 
		to: req.user.username 
	})
	.then((request, err) => {
		if(err || !request) { 
  		res.status(err ? 500 : 400).end()
		} else {
			res.json(request)
		}
	}).catch((err) => {
		res.status(400).end()
	})
};	


const updateRequest = (req, res) => { 
	Request.findById(req.params.request)
	.then((request, err) => {
		if(err || !request) { 
  		res.status(err ? 500 : 400).end()
		} else if(request.to == req.user.username) {
			/*
			  [1] => Project to User
			  [2] => User to Project
			*/
			
			let member = new Member({
				project : request.type === 2 ? request.to : request.from,
	   		username: request.type === 2 ? request.from : request.to
   		});
   		console.log(member)
   		

   		member.save()
   		.then((member, err) => {
				if(err || !member) { 
  				res.status(err ? 500 : 400).end()
 				} else {
					request.remove()
					.then((request, err) => {
						if(err || !request) { 
		  				res.status(err ? 500 : 400).end()
  					} else {
  						res.status(200).end()
  					}
					})
 				}
 			})
		} else {
			res.status(404).end()
		}
	}).catch((err) => {
		res.status(400).end()
	})
};

const cancelRequest = (req, res) => {
	Request.findById(req.params.request)
	.then((request, err) => {
		if(err || !request) { 
			res.status(err ? 500 : 400).end()
		} else {
			request.remove()
			.then((request, err) => { 
				if(err || !request) { 
					res.status(err ? 500 : 400).end()
				} else {
					res.status(200).end()
				}
			})
		}
	})
	.catch( err => {
		res.status(400).end()
	})
};


module.exports = {
	sendInvitation,
	sendJoinRequest,
	sendFriendRequest,
	setProject,
	setUsername,
	getProjectRequest,
	getUserRequest,
	updateRequest,
	cancelRequest
};