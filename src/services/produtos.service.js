import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js'
import { buscarPorIdCategoria } from './categorias.service.js'

export async function listarProduto({ precoMin, precoMax } = {}) {
    const preco = {}

    if (precoMin !== undefined) {
        preco.gte = precoMin
    }

    if (precoMax !== undefined) {
        preco.lte = precoMax
    }

    return prisma.produto.findMany({
        where: Object.keys(preco).length ? { preco } : {},
        include: { categoria: true },
        orderBy: { id: 'asc' }
    })
}

export async function buscarPorIdProduto(id) {
    const produto = await prisma.produto.findUnique({
        where: { id },
        include: { categoria: true }
    })
    if (!produto) {
        throw new AppError(404, `Produto ${id} não encontrado`)
    }

    return produto
}

export async function criarProduto(dados) {
    await buscarPorIdCategoria(dados.categoriaId)
    return prisma.produto.create({ data: dados })
}

export async function atualizarProduto(id, dados) {
    await buscarPorIdProduto(id)
    if (dados.categoriaId !== undefined) {
        await buscarPorIdCategoria(dados.categoriaId)
    }
    return prisma.produto.update({
        where: { id },
        data: dados
    })
}

export async function removerProduto(id) {
    await buscarPorIdProduto(id)
    return prisma.produto.delete({
        where: { id }
    })
}
