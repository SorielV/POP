const express = require('express'),
  router = express.Router(),
  Request = require('../../controllers/request');
 
//Ruta '/api/request/...'

/*
 * @CURD Project => '/api/request'
*/
// @Middleware
router.post('/', Request.sendFriendRequest);
router.put('/:request/', Request.updateRequest);
router.delete('/:request/', Request.cancelRequest);
router.get('/user/', Request.getUserRequest);
router.param(['project'], Request.setProject);
router.get('/project/:project', Request.getProjectRequest);
router.param(['username'], Request.setUsername);
router.post('/project/:project/', Request.sendJoinRequest);
router.post('/project/:project/:username', Request.sendInvitation);


module.exports = router;
