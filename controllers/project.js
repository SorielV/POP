const Project = require('../database/project'),
  Member = require('../database/member');

//Generic
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

const isProject = (req, res, next, project) => {  
  if(/[A-Za-z0-9-_]{4,10}/.test(project)) 
  {
    Project.findOne({
      project : project
    })
    .then((project, err) => {
      if(err || !project) { 
        res.status(err ? 500 : 400).end()
      } else {
        if(req.user.username == project.username) {
          req.project = project
          req.level = 1
          next()
        } else {
          Member.findOne({
            project: project.project, username: req.user.username
          })
          .then((member, err) => {
            req.project = project
            req.level = !member ? 3 : 2
            next()
          })
        }
      }
    })
  } else {
    res.status(400).end()
  }
};

const getList = (req, res) => {
  Member.find({ 
    username: req.user.username 
  }).select('project -_id')
  .then((project, err) => {
    if(project) {
      res.json(project)    
    } else {
      res.json([])    
    }
  })
}

const createProject = (req, res) => {
  if (req.body.project && /[A-Za-z0-9-_]{4,10}/.test(req.body.project) && req.body.title && req.body.description && req.body.tag) {
    Project.findOne({ project: req.body.project.toUpperCase() })
    .then((project, err) => {
      if(project) {
        res.status(400).end()
      }
    })

    let project = new Project({
      username: req.user.username,
      project: req.body.project,
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag,
      public: (req.body.public) ? true : false,
      img: req.body.img ? req.body.img : ''
    })

    let member = new Member({
      username: req.user.username,
      project: req.body.project,
      level: 1
    })

    member.save()
    .then((member, err) => {
      if(err || !member) { 
        res.status(err ? 500 : 400).end()
      } else {
        project.save()
        .then((project, err) => {
          if(err || !project) { 
            member.remove();
            res.status(err ? 500 : 400).end()
          } else {
            res.redirect(`project/${project.project}/`)
          }
        })
      }
    }).catch((err) => {
      console.log(err)
      res.status(500).end()
    });
  } else {
    res.status(400).end()
  }
};

const getPublicProjects = (req, res) => {
  Project.find({ 
    public : true 
  })
  .then((project, err) => {
    if(err || !project) 
      res.status(err ? 500 : 400).end()
    else 
      res.json(project)  
  })
}

// Middleware
const setProject = (req, res, next, project) => {
  if(/[A-Za-z0-9-_]{4,10}/.test(project)) {
    Member.findOne({ 
      username: req.user.username, 
      project: project.toUpperCase()
    })
    .then((member, err) => {
      if(err) {
        res.status(500).end();
      } else {
        Project.findOne({
            project : project
        })
        .then((project, err) => {
          if(err || !project) { 
            res.status(err ? 500 : 400).end()
          } else {
            req.project = project;
            req.level = !member ? 3 : 2;
            next();
          }
        })
      }
    })
    .catch((err) => {
      res.status(500).end();
    })
  } else {
    res.status(400).end();
  }
}

const getViewProject = (req, res) => {
  res.render('project', { username: req.user.username, project: req.project, level: req.level});
}
  
//Get One In Middleware add in req.project
const getProject = (req, res) => {
  res.json(req.project)
}

const getUserProjects = (req, res) => {
  Member.find({ 
    username : req.user.username
  }).select('project')
  .then((member, err) => {
    if(err || !member) 
      res.status(err ? 500 : 400).end()
    else {
      let i = 0
      let regex = ''

      for(i = 0; i < member.length - 1; i++) 
      {
        regex += `^${member[i].project}$|`
      }
      regex += `^${member[i].project}$`

      Project.find({ project : { $regex: `(${regex})` , $options: "x" } })
      .then((project, err) => {
        if(err || !project)
          res.status(err ? 500 : 400).end();
        else
          res.json(project);     
      })
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).end();
  })
}

//Post return 200 or 400 
const updateProject = (req, res) => {
  let project = req.project;
  project = req.project
  project.tags = (req.body.tags) ? req.body.tags : project.tags
  project.project = (req.body.project_name) ? req.body.project_name : project.project
  project.description = (req.body.description) ? req.body.description : project.description
  project.public = (req.body.public) ? req.body.public : project.public
  project.bg = (req.body.bg) ? req.body.bg : project.bg

  project.save()
  .then((project, err) => {
    if(err || !project) 
      res.status(err ? 500 : 400).end()
    else
      res.json(project)
  })
};

const deleteProject = (req, res) => {
  Project.remove({
    _id: req.project._id
  }).then((project, err) => {
    if (!err) {
      res.status(200).end()
    }
  })
  .catch(err => {
    console.log(err)
    res.status(400).end()  
  })
};

module.exports =  {
  createProject,
  getPublicProjects,
  getList,
  isProject,
  getProject,
  getViewProject,
  getUserProjects,
  updateProject,
  deleteProject
};
