import { Router } from 'express'
import routerAuth from './authRoute.js'
import routerPost from './postRoute.js'

const router = Router()

router.use('/auth', routerAuth)
router.use('/post', routerPost)

export default router