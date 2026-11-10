import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js'

export async function listarProduto(min, max) {
    const preco = {}

    if (min !== undefined && !isNaN(min)) {
        preco.gte = Number(min)
    }

    if (max !== undefined && !isNaN(max)) {
        preco.lte = Number(max)
    }

    return await prisma.produto.findMany({
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
    return prisma.produto.create({ data: dados })
}

export async function atualizarProduto(id, dados) {
    await buscarPorId(id)
    return prisma.produto.update({
        where: { id }, 
        data: dados
    })
}

export async function removerProduto(id) {
    await buscarPorId(id)
    return prisma.produto.delete({
        where: {id}
    })
}