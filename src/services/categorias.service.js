import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js'

export async function listarCategoria() {
    return prisma.categoria.findMany()
}

export async function buscarPorIdCategoria(id) {
    const categoria = await prisma.categoria.findUnique({
        where: { id },
        include: { produtos: true }
    })
    if (!categoria) {
        throw new AppError(404, `Categoria ${id} não encontrado`)
    }

    return categoria
}

export async function criarCategoria(dados) {
    return prisma.categoria.create({ data: dados })
}

export async function removerCategoria(id) {
    await buscarPorId(id)
    return prisma.categoria.delete({
        where: {id}
    })
}