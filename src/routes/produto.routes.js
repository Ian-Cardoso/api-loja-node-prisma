import { Router } from 'express'
import * as produtoController from '../controllers/produtos.controller.js'

const router = Router()

router.get('/', produtoController.listarProdutosSchema)
router.get('/:id', produtoController.buscarPorIdProduto)
router.post('/', produtoController.criarProdutoSchema)
router.put('/:id', produtoController.atualizarProdutoSchema)
router.delete('/:id', produtoController.removerProduto)

export default router