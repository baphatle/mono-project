import { Router } from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { createOnePost, deleteOnePost, getAll, updateOnePost } from '../controllers/postController.js'


const routerPost = Router()

routerPost.get('/', getAll)
routerPost.post('/', verifyToken, createOnePost)
routerPost.put('/:postId', verifyToken, updateOnePost)
routerPost.delete('/:postId', verifyToken, deleteOnePost)



export default routerPost