const Request = require('../database/request'),
	User = require('../database/user'),
	Project = require('../database/project'),
	Member = require('../database/member');

function findMember(params) {
	return new Promise((resolve, reject) => {
		Member.findOne(params)
		.then((member, err) => {
			if(err || member) {
				console.log(err)
				console.log(member)
				return reject(member ? 400 : 500)
			}
			resolve()
		})
	})
}

function findRequest(params) {
	return new Promise((resolve, reject) => {
		Request.findOne(params)
		.then((request, err) => {
			if(err || request) {
				return reject(request ? 400 : 500)
			}
			resolve()
		})
	})
}

function findOne(object, params) {
	return new Promise( (resolve, reject) => {
		object.findOne(params)
		.then( (item, err) => {
			if(err || !item) {
				return reject(err ? 400 : 500)
			}
			resolve(item)
		})
	})
}

function find(object, params) {
	return new Promise( (resolve, reject) => {
		object.find(params)
		.then( (items, err) => {
			if(err) {
				return reject(err ? 400 : 500)
			}
			resolve(items)
		})
	})
}

function save(object) {
	return new Promise((resolve, reject) => {
		object.save()
		.then((item, err) => {
			if(err || !item) { 
				return reject(err ? 500 : 400)
			}
			resolve(item)
		})
	})
}

function remove(object) {
	return new Promise((resolve, reject) => {
		object.remove()
		.then((item, err) => {
			if(err || !item) { 
				return reject(err ? 500 : 400)
			}
			resolve(item)
		})
	})	
}

const setProject = (req, res, next, project)=> {
	project = project.toUpperCase()
	if(/[A-Za-z0-9-_]{4,10}/.test(project)) 
	{ 
		findOne(Project, { project : project })
		.then((project) => {
			req.project = project
			next()
		})
		.catch((code) => {
			res.status(code).end()
		})
	} else {
		res.status(400).end()
	}
};

const sendInvitation = (req, res) => {
	if(req.username) 
	{
		findOne(User, { username: req.params.username })
		.then(() => {
		 	return findMember({ username: req.username, project: req.project.project })
		})
		.then(() => {
			return findRequest({ from: req.project.project, to: req.username })
		})
		.then(() => {
			return new Request({
				type : 1,
				from : req.project.project,
				to : req.username,
				content : req.params.content ? req.params.content : ''
			})
		})
		.then(request => {
			return save(request)
		}).then(() => {
			res.status(200).end()	
		})
		.catch((code) => {
			res.status(code).end()
		})
	} else {
		res.status(400).end()
	}
	/*
	let request = new Request({
		type : 1,
		from : req.project.project,
		to : req.username,
		content : req.params.content ? req.params.content : ''
	})
	save(request)
	.then(() => {
		res.status(200).end()
	})
	.catch((code) => {
		res.status(code).end()
	})*/
};

function sendJoinRequest (req, res) { 
	findMember({ username: req.user.username, project: req.project.project })
	.then(() => {
		return findRequest({ from: req.user.username, to: req.project.project })
	})
	.then(() => {
		return request = new Request({
			type : 2,
			from : req.user.username,
			to : req.project.project,
			content : req.params.content ? req.params.content : ''
		})
	})
	.then(request => {
		return save(request)
	}).then(() => {
		return res.status(200).end()	
	})
	.catch((code) => {
		return res.status(code).end()
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

const setUsername = (req, res, next, username) => {
	findOne(User, { username : username }) 
	.then((user) => {
		req.username = user.username
		next()
	})
	.catch((code) => {
		res.status(code).end()
	})
};

const getProjectRequest = (req, res) => {
	find(Request, { to: req.params.project })
	.then(requests => {
		return res.json(requests)
	})
	.catch((err) => {
		console.log(err) 
		return res.json([])
	})
};

const getUserRequest = (req, res) => {
	find(Request, { to: req.user.username })
	.then((request) => {
		res.json(request)
	}).catch((err) => {
		res.status(400).end()
	})
};	


const updateRequest = (req, res) => { 
	let request;
	findOne(Request, { _id: req.params.request })
	.then((_request) => {
		request = _request
		return findMember({ 
			username: request.type === 1 ? request.to : request.from,
			project: request.type === 1 ? request.from : request.to 
		})
	})
	.then(() => {
		console.log(request)
		return new Member({
			project : request.type === 1 ? request.from : request.to,
	   	username: request.type === 1 ? request.to : request.from
   	}) 
	})
	.then(member => {
		console.log(request)
		return save(member)
	}).then(() => {
		return res.status(200).end()	
	})
	.catch((code) => {
		console.log(code)
		remove(request)
		return res.status(code).end()
	})
};

const cancelRequest = (req, res) => {
	findOne(Request, { _id: req.params.request })
	.then((request) => {
		return remove(request)
	})
	.then(() => {
		res.status(200).end()
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
