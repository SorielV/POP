const express = require('express'),
  router = express.Router(),
  Post = require('../../controllers/post');
 
//Ruta '/api/post/...'

/*
 * @CURD Project => '/api/post'
*/
// @Middleware

// Agregar post a determinado projecto 'target'
router.post('/', Post.createPost);

// Middleware 
// Verificar que el projecto 'target' existe
router.param(['project'], Post.isProject);

// Obtener post de el projecto 'target'
router.get('/project/:project', Post.getPosts);
// New 'api/post/project/:project/page/1/10'
// Obtener  :page => pagina , offset => (page-1)*offset 
router.get('/project/:project/page/:page/:offset/', Post.getPosts);

// Obtener post usuario actual
router.get('/user', Post.setRegex);
router.get('/user/page/:page/:offset/', Post.getPosts);
router.get('/user', Post.getPostsRegex); //Regex


// Middleaware 
// Verifica la existencia del post y *lo agrega a req.post
router.param(['post'], Post.isPost);

// {Obtine,actualiza,borra} un post con id 'target'
router.get('/:post/', Post.getPost)
router.put('/:post/', Post.updatePost);
router.delete('/:post/', Post.deletePost);

module.exports = router;
