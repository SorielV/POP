const 	
	express = require('express'),
	router = express.Router(),
  Project = require('../../controllers/project');

//Ruta '/api/project/...'
/*
 * @CURD Project => '/api/project'
*/
router.post('/', Project.createProject);
router.get('/', Project.getPublicProjects);
router.get('/user', Project.getUserProjects);
///router.get('/all', Project.getAll); 
// @Middleware
//Acceso Comun por Name y administratico por _id
//router.get('/user', Project.getUserProjects)
router.param(['project'], Project.isProject);
router.get('/:project', Project.getProject);
router.put('/:project', Project.updateProject);
router.delete('/:project', Project.deleteProject);

module.exports = router;