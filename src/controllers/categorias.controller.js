import * as categoriaService from '../services/categorias.service.js'

import {
    idParamSchema,
    listarCategoriasSchema,
    criarCategoriaSchema,
    atualizarCategoriaSchema,
} from '../schemas/categorias.schema.js'

export async function listarCategoriasSchema(req, res) {
    const filtros = listarCategoriasSchema.parse(req.query)
    const categoria = await categoriaService.listarProduto(filtros)
    return res.json(categoria)
}

export async function buscarPorIdCategoria(req, res) {
    const { id } = idParamSchema.parse(req.params)
    const categoria = await categoriaService.buscarPorIdCategoria(id)
    return res.json(categoria)
}

export async function criarCategoriaSchema(req, res) {
    const dados = criarCategoriaSchema.parse(req.body ?? {})
    const categoria = await categoriaService.criarCategoria(dados)
    return res.status(201).json(categoria)
}

export async function atualizarCategoriaSchema(req, res) {
  const { id } = idParamSchema.parse(req.params)
  const dados = atualizarCategoriaSchema.parse(req.body ?? {})
  const categoria = await categoriaService.atualizarCategoriaSchema(id, dados)
  return res.json(categoria)
}

export async function removerCategoria(req, res) {
    const { id } = idParamSchema.parse(req.params)
    await categoriaService.removerCategoria(id)
    return res.status(204).end()
}