import { Router } from 'express'
import { getCurrentUser, login, register } from '../controllers/authController.js';
import { checkCurrentUser } from '../middlewares/checkCurrentUser.js';

const routerAuth = Router()

routerAuth.post('/register', register)
routerAuth.post('/login', login) 
routerAuth.get('/', checkCurrentUser, getCurrentUser) 



export default routerAuth   