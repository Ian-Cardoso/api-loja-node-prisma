import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'
import { autenticar } from '../middlewares/autenticar.js'

const router = Router()

router.post('/cadastro', authController.cadastrar)
router.post('/login', authController.login)
router.get('/me', autenticar, authController.perfil)

export default router