const Project = require('../database/project'),
  Member = require('../database/member');

const isProject = (req, res, next, project) => {
  Project.findOne({
    project : project
  })
  .then((project, err) => {
    if(err || !project) { 
      res.status(err ? 500 : 400).end();
    } else {
      if(req.user.username == project.username) {
        req.project = project;
        req.level = 1;
        next();    
      } else {
        Member.find({
          project: project.project, username: req.user.username
        })
        .then((member, err) => {
          if(err || !member || member.length == 0) { 
            req.project = project;
            req.level = 3;
            next();
          }else {
            console.log(member)
            console.log('member 2')
            req.project = project;
            req.level = 2;
            next();    
          }
        });
      }
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).end();
  });
};

const createProject = (req, res) => {
  if (req.body.project && req.body.title && req.body.description && req.body.tag && req.body.img) {
    let project = new Project({
      username: req.user.username,
      project: req.body.project,
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag,
      public: (req.body.public) ? true : false,
      img: req.body.img
    });

    let member = new Member({
      username: req.user.username,
      project: req.body.project,
      level: 1
    });
    console.log('Creacion de Proyecto');  

    member.save()
    .then((member, err) => {
      if(err || !member) { 
        res.status(err ? 500 : 400).end();
      } else {
        project.save()
        .then((project,err)=> {
          if(err || !project) { 
            member.remove();
            res.status(err ? 500 : 400).end();
          } else {
            res.redirect(`project/${project.project}/`);
          }
        });
      }
    }).catch((err) => {
      console.log(err);
      res.status(500).end();
    });
  } else {
    res.status(400).end();
  }
};

const getPublicProjects = (req, res) => {
  Project.find({ 
    public : true 
  })
  .then((project, err) => {
    if(err) { 
      res.status(500).end();
    } else if(!project) {
      res.status(400).end();
    } else {
      res.json(project);     
    }
  });
};

// Middleware
const setProject = (req, res, next, project) => {
  console
  Member.findOne({ 
    username : req.user.username, project : project
  })
  .then((member, err) => {
    if(err) {
      res.status  (500).end();
    //} else if(!member) {
    } else {
      if(project.length < 8) {
        Project.findOne({
          project : project
        })
        .then((project, err) => {
          if(err) { 
            res.status(500).end();
          } else if(!project) {
            res.status(400).end();
          } else {
            if(!member) {
              req.project = project;
              req.level = 3;
              next();
            } else {
              req.project = project;
              req.level = 2;
              next();
            }
          }
        });
        /*.catch((err) => {
          res.status(400).end();
        });*/
      } else {
        /*Project.findById(project)
        .then((project, err) => {
        if(err) { 
          res.status(500).end();
        } else if(!project) {
          res.status(400).end();
        } else {
          req.project = tag_project;
          req.level = 3;
          next();
        }
        });*/
        //.catch((err) => {
          res.status(400).end();
        //});
      }
    }
  })
  .catch((err) => {
    res.status(400).end();
  });
};

const getViewProject = (req, res) => {
  //console.log(req.project);
  res.render('project', { username: req.user.username, project: req.project, level: req.level});
};
  

//Get One In Middleware add in req.project
const getProject = (req, res) => {
  res.json(req.project)
};

const getUserProjects = (req, res) => {
  //console.log('getUserProjects')
  Member.find({ 
    username : req.user.username
  }).select('project')
  .then((member, err) => {
    if(err || !member) { 
      res.status(err ? 500 : 400).end();
    } else {
      let i = 0;
      let regex = '';

      for(i = 0; i < member.length - 1; i++) 
      {
        regex += `^${member[i].project}$|`; 
      }
      regex += `^${member[i].project}$`; 
      //console.log(regex)
      console.log(`(${regex})`)
      Project.find({ project : { $regex: `(${regex})` , $options: "x" } })
      .then((project, err) => {
        if(err) { 
          res.status(500).end();
        } else if(!project) {
          res.status(400).end();
        } else {
          res.json(project);     
        }
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

  project = req.project;
  project.tags = (req.body.tags) ? req.body.tags : project.tags;
  project.project = (req.body.project_name) ? req.body.project_name : project.project;
  project.description = (req.body.description) ? req.body.description : project.description;
  project.public = (req.body.public) ? req.body.public : project.public;
  project.bg = (req.body.bg) ? req.body.bg : project.bg;

  project.save()
  .then((project, err) => {
    if(err) {
      res.status(500).end();
    } else if(!project) {
      res.status(404).end();
    } else {
      res.json(project);
    }
  });
};

const deleteProject = (req, res) => {
  Project.remove({
    _id: req.project._id
  }).then((project, err) => {
    if (!err) {
      res.status(200).end();
    }
  });
  res.status(400).end();
};

module.exports =  {
  createProject,
  getPublicProjects,
  isProject,
  getProject,
  getViewProject,
  getUserProjects,
  updateProject,
  deleteProject
};
