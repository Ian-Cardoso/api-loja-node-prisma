import { Router } from 'express'
import * as categoriaController from '../controllers/categorias.controller.js'

const router = Router()

router.get('/', categoriaController.listarCategoriasSchema)
router.get('/:id', categoriaController.buscarPorIdCategoria)
router.post('/', categoriaController.criarCategoriaSchema)
router.put('/:id', categoriaController.atualizarCategoriaSchema)
router.delete('/:id', categoriaController.removerCategoria)

export default router