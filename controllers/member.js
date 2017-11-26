const Member = require('../database/member');
//pre params for valid

//For Project
const addMember = (req, res) => {
	if(req.params.project_tag && req.params.username) {
		let member = new Member({
	   username: req.params.username,
	    tag: req.params.project_tag
	   });

    member.save()
    .then( (member, err) => {
    	if(err) { 
        res.status(500).end();
    	} else if(!member) {
    		res.status(400).end();
    	} else {
        res.status(200).end();
      }
    });
	}
};

const setMembers = (req, res, next, project) => {
  //console.log('setMembers',project)
  Member.find({ project: project })
  .then( (member, err) => {
    if(err) { 
      res.status(500).end();
    } else if(!member) {
      res.status(400).end();
    } else {
      //console.log(member)
      req.member = member;
      next();
    }
  }).catch((err) => {
    res.status(400).end();
  });
};

const setMember = (req, res, next, member) => {
  Member.findById(member)
  .then( (member, err) => {
    if(err) { 
      res.status(500).end();
    } else if(!member) {
      res.status(400).end();
    } else {
      req.member = member;
      next();
    }
  }).catch((err) => {
    res.status(400).end();
  });
};

const getMember = (req, res) => {
  res.json(req.member);
};

const getMembers = (req, res) => {
  res.json(req.member);
};

const deleteMember = (req, res) => {
  Member.remove(req.member._id)
  .then((member, err) => {
    if(err) { 
      res.status(500).end();
    } else if(!member) {
      res.status(400).end();
    } else {
      res.status(200).end();
    }
  }).catch((err) => {
    res.status(400).end();
  });
};


module.exports = {
  setMember,
  setMembers,
  getMember,
  getMembers,
	addMember,
  deleteMember
}