import * as categoriaService from '../services/categorias.service.js'

import {
    idParamSchema,
    criarCategoriaSchema,
    atualizarCategoriaSchema,
} from '../schemas/categorias.schema.js'

export async function listarCategorias(req, res) {
    const categorias = await categoriaService.listarCategoria()
    return res.json(categorias)
}

export async function buscarPorIdCategoria(req, res) {
    const { id } = idParamSchema.parse(req.params)
    const categoria = await categoriaService.buscarPorIdCategoria(id)
    return res.json(categoria)
}

export async function criarCategoria(req, res) {
    const dados = criarCategoriaSchema.parse(req.body ?? {})
    const categoria = await categoriaService.criarCategoria(dados)
    return res.status(201).json(categoria)
}

export async function atualizarCategoria(req, res) {
    const { id } = idParamSchema.parse(req.params)
    const dados = atualizarCategoriaSchema.parse(req.body ?? {})
    const categoria = await categoriaService.atualizarCategoria(id, dados)
    return res.json(categoria)
}

export async function removerCategoria(req, res) {
    const { id } = idParamSchema.parse(req.params)
    await categoriaService.removerCategoria(id)
    return res.status(204).end()
}
