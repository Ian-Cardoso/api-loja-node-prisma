import { Router } from 'express'
import * as produtoController from '../controllers/produtos.controller.js'
import { autenticar } from '../middlewares/autenticar.js'

const router = Router()

router.get('/', produtoController.listarProdutos)
router.get('/:id', produtoController.buscarPorIdProduto)
router.post('/', autenticar, produtoController.criarProduto)
router.put('/:id', autenticar, produtoController.atualizarProduto)
router.delete('/:id', autenticar, produtoController.removerProduto)

export default router
