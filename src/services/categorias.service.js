import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js'

export async function listarCategoria() {
    return prisma.categoria.findMany({ orderBy: { id: 'asc' } })
}

export async function buscarPorIdCategoria(id) {
    const categoria = await prisma.categoria.findUnique({
        where: { id },
        include: { produtos: true }
    })
    if (!categoria) {
        throw new AppError(404, `Categoria ${id} não encontrada`)
    }

    return categoria
}

export async function criarCategoria(dados) {
    return prisma.categoria.create({ data: dados })
}

export async function atualizarCategoria(id, dados) {
    await buscarPorIdCategoria(id)
    return prisma.categoria.update({
        where: { id },
        data: dados
    })
}

export async function removerCategoria(id) {
    await buscarPorIdCategoria(id)
    return prisma.categoria.delete({
        where: { id }
    })
}
