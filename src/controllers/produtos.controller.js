import * as produtoService from '../services/produtos.service.js'

import {
    idParamSchema,
    listarProdutosSchema,
    criarProdutoSchema,
    atualizarProdutoSchema,
} from '../schemas/produtos.schema.js'

export async function listarProdutos(req, res) {
    const filtros = listarProdutosSchema.parse(req.query)
    const produtos = await produtoService.listarProduto(filtros)
    return res.json(produtos)
}

export async function buscarPorIdProduto(req, res) {
    const { id } = idParamSchema.parse(req.params)
    const produto = await produtoService.buscarPorIdProduto(id)
    return res.json(produto)
}

export async function criarProduto(req, res) {
    const dados = criarProdutoSchema.parse(req.body ?? {})
    const produto = await produtoService.criarProduto(dados)
    return res.status(201).json(produto)
}

export async function atualizarProduto(req, res) {
    const { id } = idParamSchema.parse(req.params)
    const dados = atualizarProdutoSchema.parse(req.body ?? {})
    const produto = await produtoService.atualizarProduto(id, dados)
    return res.json(produto)
}

export async function removerProduto(req, res) {
    const { id } = idParamSchema.parse(req.params)
    await produtoService.removerProduto(id)
    return res.status(204).end()
}
