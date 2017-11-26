const express = require('express'),
  router = express.Router(),
  Profile = require('../../controllers/profile');
 
//Ruta '/api/profile/...'

/*
 * @CURD Project => '/api/post'
*/

//Update
router.get('/', Profile.getProfile);
router.put('/', Profile.updateProfile);
//Delete
router.delete('/', Profile.deleteUser);

module.exports = router;
