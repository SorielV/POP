const express = require('express'),
  router = express.Router(),
  Comment = require('../../controllers/comment');
 
//Ruta '/api/post/...'

/*
 * @CURD Project => '/api/post'
*/
// @Middleware

// Aderir/Crear un comentario a un post determinado 
router.post('/post/:post', Comment.createComment);
// Middelware 
// Compara que el post 'target' exista
router.param(['post'], Comment.setComments);
// Obtener comentario del post 'target' [todos] 'uso general' 
router.get('/post/:post', Comment.getComments);

router.param(['comment'], Comment.setComment);
router.get('/:comment/', Comment.getComment)
router.put('/:comment/', Comment.updateComment);
router.delete('/:comment/', Comment.deleteComment);

module.exports = router;

/* Logic */
/*
	Post.newComment => post ? newComment : 400 

	Stack 
	Comment 5
	Comment 4
	Comment 3
	Comment 2
	Comment 1

*/

