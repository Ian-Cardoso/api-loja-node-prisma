import { Router } from 'express'
import * as categoriaController from '../controllers/categorias.controller.js'
import { autenticar } from '../middlewares/autenticar.js'
import { autorizar } from '../middlewares/autorizar.js'

const router = Router()

router.get('/', categoriaController.listarCategorias)
router.get('/:id', categoriaController.buscarPorIdCategoria)
router.post('/', autenticar, autorizar('ADMIN'),  categoriaController.criarCategoria)
router.put('/:id', autenticar, autorizar('ADMIN'),categoriaController.atualizarCategoria)
router.delete('/:id', autenticar, autorizar('ADMIN'), categoriaController.removerCategoria)

export default router
