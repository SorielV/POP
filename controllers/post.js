const Project = require('../database/project'),
      Member = require('../database/member'),
      Post = require('../database/post'),
      Pagination = require('../controllers/pagination');

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

// Verifica que el projecto 'target' exista
const isProject = (req, res, next, project) => {
  if(/[A-Za-z0-9-_]{4,10}/.test(project)) {
    Member.findOne({ project: project, username: req.user.username})
    .then((member, err) => {
      if(err || !member) { 
        res.status(err ? 500 : 400).end()
      } else {
        Project.findOne({
          project : project
        })
        .then((project, err) => {
          if(err || !project) { 
            res.status(err ? 500 : 400).end()
          } else {
            req.project = project.project
            next()
          }
        })
      }
    })
  } else {
    res.status(400).end()
  }
}

// Verifica que el post 'target' exista
const isPost = (req, res, next, id) => {
  Post.findById(id)
  .then((post, err) => {
    if(err || !post) { 
      res.status(err ? 500 : 400).end()
    } else {
      req.post = post
      next()
    }
  })
  .catch((err) => {
    console.log(err)
    res.status(500).end()
  })
}

// Crea una expresion regular con los projectos a los cuales el usuario tiene acceso
const setRegex = (req, res, next) => {
  Member.find({ 
    username : req.user.username
  }).select('project')
  .then((member, err) => {
    console.log(member.length)
    if(err || !member || member.length === 0) { 
      res.status(err ? 500 : 400).end()
    } else {
      let i = 0
      let regex = ''

      for(i = 0; i < member.length - 1; i++) 
      {
        regex += `^${member[i].project}$|`
      }
      regex += `^${member[i].project}$`
      req.regex = `(${regex})`
      next()
    }
  })
}

// Crea un post 
// Valida que el post dentro de 'body' de 'request' exista
const createPost = (req, res) => {
  if(req.body.project && /[A-Za-z0-9-_]{4,10}/.test(req.body.project) && req.body.title && req.body.content) {
    Member.findOne({ 
      project: req.body.project,
      username: req.user.username
    })
    .then((member, err) => {
      if(err || !member) { 
        res.status(err ? 500 : 400).end()
      } else {
        let post = new Post({
          username: req.user.username,
          project: req.body.project,
          title: req.body.title,
          content: req.body.content
        })
        post.save()
        .then((post, err) => {
          if(err || !post) { 
            res.status(err ? 500 : 400).end()
          } else {
            res.json(post)
          }
        })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
  } else {
    res.status(500).end()
  }
}

// Obtener Post por _id
const getPost = (req, res) => {
  find(Post, { _id : req.params.post })
  .then((posts) => {
    res.json(posts)
  })
  .catch((code) => {
    console.log('Error')
    res.json({})
    res.status(code).end()
  })
  /*Post.findById(req.params.post)
  .then((post, err) => {
    if(err || !post) { 
      res.status(err ? 500 : 400).end()
    } else {
      res.json(post)
    }
  })
  .catch((err) => {
    //Invalid ID
    console.log(err)
    res.status(500).end()
  })*/ 
}

// Obtener Posts del projecto 'target'
const getPosts = (req, res) => {
  find(Post, { project : req.project })
  .then((posts) => {
    res.json(posts)
  })
  .catch((code) => {
    console.log('Error')
    res.json([])
    res.status(code).end()
  })
}

// Obtener Posts del/los projecto/s 'target' 
const getPostsRegex = (req, res) => {
  Post.count({ 
    project : { $regex: req.regex, $options: "x" }
  })
  .then((total_post, err) => {
    if(err) { 
      res.status(500).end()
    } else if(!total_post) {
      res.status(400).end()
    } else {
      let pagination = new Pagination(total_post, 1, 10)
      Post.find({ project : { $regex: req.regex, $options: "x" }})
      .then((post, err) => {
        if(err) { 
          res.status(500).end()
        } else if(!post) {
          res.status(400).end()
        } else {
          pagination.data = post
          res.json(pagination)
        }
      }) 
    }
  })
  .catch((err) => {
    console.log(err)
    res.status(500).end()
  })
}

//Add remove comments ++
const deletePost = (req, res) => {
  Post.remove({
    _id: req.post._id
  }).then((post, err) => {
    if(err || !post) 
      res.status(err ? 500 : 400).end()
    else 
      res.status(200).end()
  })
  .catch((err) => {
    console.log(err)
    res.status(500).end()
  })
}

const updatePost = (req, res) => {
  let post = req.post

  post.title = req.body.title ? req.body.title : post.title
  post.content = req.body.content ? req.body.content : post.content

  post.save().then((post, err) => {
    if(err) { 
      res.status(500).end()
    } else if(!post) {
      res.status(400).end()
    } else {
      res.json(post)
    }
  })
}

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
}
