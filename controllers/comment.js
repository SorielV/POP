const Comment = require('../database/comment'),
      Post = require('../database/post');

const createComment = (req, res) => {
  if (req.body.content) {
    Post.findById(req.params.post)
    .then((post, err) => {
      if(err) { 
        res.status(500).end();
      } else if(!post) {
        res.status(400).end();
      } else {
        let comment = new Comment({
          username: req.user.username,
          project : post.project,
          post: post._id,
          content: req.body.content
        });

        comment.save()
        .then( (comment, err) => {
          if(err) { 
            res.status(500).end();
          } else if(!comment) {
            res.status(400).end();
          } else {
            res.json(comment);     
          }
        });
      }  
    }).catch( (err) => {
      res.status(400).end();
    });
  } else {
    res.status(400).end();
  }
};

const setComment = (req, res, next, comment) => {
  Comment.findById(comment)
  .then((comment, err) => {
    if(err) { 
      res.status(500).end();
    } else if(!comment) {
      res.status(400).end();
    } else {
      req.comment = comment;
      next();
    }
  }).catch(() => {
    res.status(400).end();  
  }); 
};

const setComments = (req, res, next, post) => {
  Comment.find({
    post : post
  })
  .then((comment, err) => {
    if(err) { 
      res.status(500).end();
    } else if(!comment) {
      res.status(400).end();
    } else {
      req.comment = comment;
      next();
    }
  }).catch((err) => {
    res.status(400).end();  
  }); 
};

const getComment = (req, res) => {
  res.json(req.comment);
};

const getComments = (req, res) => {
  res.json(req.comment);
}

//Add remove comments ++
const deleteComment = (req, res) => {
  Comment.remove({
    _id: req.params._id
  }).then((comment, err) => {
    if(err) { 
      res.status(500).end();
    } else if(!comment) {
      res.status(400).end();
    } else {
      res.status(200).end();
    }
  });
};

const updateComment = (req, res) => {
  let comment = req.comment;
  comment.content = req.body.content ? req.body.content : comment.content;

  comment.save().then((comment, err) => {
    if(err) { 
      res.status(500).end();
    } else if(!comment) {
      res.status(400).end();
    } else {
      res.json(comment);
    }
  });
};

module.exports = {
  createComment,
  setComment,
  setComments,
  getComment,
  getComments,
  deleteComment,
  updateComment
};
