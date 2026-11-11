import { Router } from 'express'
import * as categoriaController from '../controllers/categorias.controller.js'
import { autenticar } from '../middlewares/autenticar.js'

const router = Router()

router.get('/', categoriaController.listarCategorias)
router.get('/:id', categoriaController.buscarPorIdCategoria)
router.post('/', autenticar, categoriaController.criarCategoria)
router.put('/:id', autenticar, categoriaController.atualizarCategoria)
router.delete('/:id', autenticar, categoriaController.removerCategoria)

export default router
