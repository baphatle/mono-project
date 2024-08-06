import { Router } from 'express'
import { verifyRole, verifyToken } from '../middlewares/verifyToken.js'
import { commentPost, createOnePost, deleteOnePost, getAll, likePost, updateOnePost } from '../controllers/postController.js'


const routerPost = Router()

routerPost.get('/', getAll)
routerPost.post('/', verifyToken, createOnePost)
routerPost.put('/:postId', verifyToken, updateOnePost)
routerPost.delete('/:postId', verifyRole, deleteOnePost)
routerPost.post('/like/:postId', verifyToken, likePost)
routerPost.post('/comment/:postId', verifyToken, commentPost)

export default routerPost