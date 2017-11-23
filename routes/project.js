const express = require('express'),
  passport = require('passport'),
  router = express.Router(),
  Project = require('../controllers/project');

router.get('/', (req, res) => {
  res.render('group', { username: req.user.username})
});

router.get('/user', (req, res) => {
  res.render('projects-user', { username: req.user.username})
})


router.post('/', Project.createProject);
router.get('/find', Project.getPublicProjects);

router.param(['project'], Project.isProject);
router.get('/:project', Project.getViewProject);
/*router.get('/:project/post', Posts.getPost)
router.post('/:project/post', Posts.createPost);*/

/*router.post('/:project/:post/comment', (req, res) => {
  if (req.body.content) {
    let comment = new Comments(
      {
        username: req.user.username,
        group: req.params.project,
        post: req.params.post,
        content: req.body.content
      });

      comment.save().then( (comment, err) => {
      if(err) { 
        res.status(500).end();
      } else if(!comment) {
        res.status(400).end();
      } else {
        res.status(200).end();
      }
    });
  } else {
    res.status(400).end();
  }
});
//Consulta y envia un json con los comentarios del post indicado del gropo indicado
/*router.get('/:project/:post/comment', (req, res) => {
  Comments.find({ post: req.params.post }).then((comment, err) => {
        res.json(comment);
  });
});

//Middleaware Implemented in :project
router.param(['project'], Project.getProject);
router.get('/comment/post/:post', Comment.getComments);*/


module.exports = router;
