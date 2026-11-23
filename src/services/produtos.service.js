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

function garantirPermissao(produto, usuario) {
  const ehDono = produto.criadoPorId === usuario.id
  const ehAdmin = usuario.papel === 'ADMIN'
  if (!ehDono && !ehAdmin) {
    throw new AppError(403, 'Só o dono do produto ou um admin pode fazer isso')
  }
}

export async function criarProduto(dados, usuario) {
    await buscarPorIdCategoria(dados.categoriaId)
    return prisma.produto.create({ data: {...dados, criadoPorId: usuario.id }, })
}

export async function atualizarProduto(id, dados, usuario) {
    const produto = await buscarPorIdProduto(id)
    garantirPermissao(produto, usuario)
    if (dados.categoriaId !== undefined) {
        await buscarPorIdCategoria(dados.categoriaId)
    }
    return prisma.produto.update({
        where: { id },
        data: dados
    })
}

export async function removerProduto(id, usuario) {
    const produto = await buscarPorIdProduto(id)
    garantirPermissao(produto, usuario)
    return prisma.produto.delete({
        where: { id }
    })
}