const express = require('express'),
  router = express.Router(),
  Member = require('../../controllers/member');
 
//Ruta '/api/member/...'

/*
 * @CURD Member => '/api/member'
*/
// @Middleware
router.param(['project'], Member.setMembers);
router.get('/project/:project', Member.getMembers);

module.exports = router;