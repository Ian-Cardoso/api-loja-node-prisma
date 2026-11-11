import { Router } from 'express'
import * as produtoController from '../controllers/produtos.controller.js'

const router = Router()

router.get('/', produtoController.listarProdutos)
router.get('/:id', produtoController.buscarPorIdProduto)
router.post('/', produtoController.criarProduto)
router.put('/:id', produtoController.atualizarProduto)
router.delete('/:id', produtoController.removerProduto)

export default router
