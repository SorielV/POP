const express = require('express'),
  passport = require('passport'),
  router = express.Router(),
  Project = require('../controllers/project');

router.get('/', (req, res) => {
  res.render('projects', { username: req.user.username})
});

router.get('/user', (req, res) => {
  res.render('myprojects', { username: req.user.username})
})

router.post('/', Project.createProject);
router.param(['project'], Project.isProject);
router.get('/:project', Project.getViewProject);

module.exports = router;
