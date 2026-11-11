import { Router } from 'express'
import * as categoriaController from '../controllers/categorias.controller.js'

const router = Router()

router.get('/', categoriaController.listarCategorias)
router.get('/:id', categoriaController.buscarPorIdCategoria)
router.post('/', categoriaController.criarCategoria)
router.put('/:id', categoriaController.atualizarCategoria)
router.delete('/:id', categoriaController.removerCategoria)

export default router
