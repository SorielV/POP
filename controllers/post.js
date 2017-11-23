const Project = require('../database/project'),
      Member = require('../database/member'),
      Post = require('../database/post'),
      Pagination = require('../controllers/pagination');

// Verifica que el projecto 'target' exista
const isProject = (req, res, next, project) => {

  /*Project.findOne({
    project : project
  })
  .then((project, err) => {
    if(err || !project) { 
      res.status(err ? 500 : 400).end();
    } else {
      req.project = project.project;
      next();
    }
  })*/
  Member.findOne({ project: project, username: req.user.username})
  .then((member, err) => {
    if(err || !member) { 
      res.status(err ? 500 : 400).end();
    } else {
      Project.findOne({
        project : project
      })
      .then((project, err) => {
        if(err || !project) { 
          res.status(err ? 500 : 400).end();
        } else {
          req.project = project.project;
          next();
        }
      })
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).end();
  });
};

// Verifica que el post 'target' exista
const isPost = (req, res, next, id) => {
  Post.findById(id) 
  .then((post, err) => {
    if(err || !post) { 
      res.status(err ? 500 : 400).end();
    } else {
      req.post = post;
      next();
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).end();
  });
};

// Crea una expresion regular con los projectos a los cuales el usuario tiene acceso
const setRegex = (req, res, next) => {
  Member.find({ 
    username : req.user.username
  }).select('project')
  .then((member, err) => {
    if(err || !member) { 
      res.status(err ? 500 : 400).end();
    } else {
      console.log(member)
      let i = 0
      let regex = ''
      for(i = 0; i < member.length - 1; i++) 
      {
        regex += `^${member[i].project}$|`; 
      }
      regex += `^${member[i].project}$`;
      console.log(regex) 
      //console.log(regex);
      req.regex = `(${regex})`;
      next();
    }
  });
}

// Crea un post 
// Valida que el post dentro de 'body' de 'request' exista
const createPost = (req, res) => {
  console.log('Creacion de post');  
  if(req.body.project && req.body.title && req.body.content) {
    /*
    Project.findOne({
      project: req.body.project.toUpperCase()
    })
    .then((project, err) => {
      if(err || !project) { 
        res.status(err ? 500 : 400).end();
      } else {
        let post = new Post({
          username: req.user.username,
          project: project.project,
          title: req.body.title,
          content: req.body.content
        });

        post.save()
        .then((post, err) => {
          if(err || !post) { 
            res.status(err ? 500 : 400).end();
          } else {
            res.json(post);     
          }
        });
      }
    })*/
    Member.findOne({ project: req.body.project, username: req.user.username})
    .then((member, err) => {
      if(err || !member) { 
        res.status(err ? 500 : 400).end();
      } else {
        let post = new Post({
          username: req.user.username,
          project: req.body.project,
          title: req.body.title,
          content: req.body.content
        });
        post.save()
        .then((post, err) => {
          if(err || !post) { 
            res.status(err ? 500 : 400).end();
          } else {
            res.json(post);     
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
  } else {
    res.status(500).end();
  }
};


// Obtener Post por _id
const getPost = (req, res) => {
  Post.findById(req.params.post)
  .then((post, err) => {
    if(err || !post) { 
      res.status(err ? 500 : 400).end();
    } else {
      res.json(post);
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).end();  
  }); 
};

// Obtener Posts del projecto 'target'
const getPosts = (req, res) => {
  Post.find({
    project : req.project
  })
  .then((post, err) => {
    if(err) { 
      res.status(err ? 500 : 400).end();
    } else {
      res.json(post);
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).end();  
  }); 
};

// Obtener Posts del/los projecto/s 'target' 
const getPostsRegex = (req, res) => {
  //db.posts.find({project: { $regex : "(3$|2$)", $options: "x" } })5)", $options: "x" } })
  Post.count({ 
    project : { $regex: req.regex, $options: "x" }
  })
  .then((total_post, err) => {
    if(err) { 
      res.status(500).end();
    } else if(!total_post) {
      res.status(400).end();
    } else {
      let pagination = new Pagination(total_post, 1, 10);
      Post.find({ project : { $regex: req.regex, $options: "x" }})
      .then((post, err) => {
        if(err) { 
          res.status(500).end();
        } else if(!post) {
          res.status(400).end();
        } else {
          pagination.data = post;
          res.json(pagination);
        }
      }); 
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).end();
  });
};

//Add remove comments ++
const deletePost = (req, res) => {
  Post.remove({
    _id: req.post._id
  }).then((post, err) => {
    if(err) { 
      res.status(500).end();
    } else if(!post) {
      res.status(400).end();
    } else {
      res.status(200).end();
    }
  });
};

const updatePost = (req, res) => {
  let post = req.post;

  post.title = req.body.title ? req.body.title : post.title;
  post.content = req.body.content ? req.body.content : post.content;

  post.save().then((post, err) => {
    if(err) { 
      res.status(500).end();
    } else if(!post) {
      res.status(400).end();
    } else {
      res.json(post);
    }
  });
};

module.exports = {
  isProject,
  isPost,
  setRegex,
  createPost,
  getPost,
  getPosts,
  getPostsRegex,
  deletePost,
  updatePost
};

/*const getPostByProjectName = (req, res) => {
  Post.find({
    project : req.params.project
  })
  .then((post, err) => {
    if(err) {   
      res.status(500).end();
    } else if(!post) {
      res.status(400).end();
    } else {
      res.json(post);     
    }
  });
};

const getPostById = (req, res) => {
  Post.findOne({
    _id: req.params._id
  }).then((post, err) => {
    if(err) { 
      res.status(500).end();
    } else if(!post) {
      res.status(400).end();
    } else {
      res.json(post);     
    }
  });
};*/