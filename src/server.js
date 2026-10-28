import express from 'express'
import { prisma } from './lib/prisma.js'

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next()
})

const idValido = (valor) => {
    const id = Number(valor)
    return Number.isInteger(id) && id > 0 ? id : null
}

const precoValido = (valor) => typeof valor === 'number' && Number.isFinite(valor) && valor > 0

// Rotas para a Categoria

app.get('/categorias', async (req, res) => {
    const categorias = await prisma.categoria.findMany()

    return res.status(200).json(categorias)
})

app.get('/categorias/:id', async (req, res) => {
    const id = idValido(req.params.id)

    if (!id) {
        return res.status(400).json({ erro: `Id invalido` })
    }

    const categoria = await prisma.categoria.findUnique({
        where: { id },
        include: { produtos: true }
    })

    if (!categoria) {
        return res.status(404).json({ erro: `Id nao encontrado` })
    }

    return res.status(200).json(categoria)
})

app.post('/categorias', async (req, res) => {
    const { nome } = req.body ?? {}

    if (typeof nome !== 'string' || !nome.trim()) {
        return res.status(400).json({ erro: `Nome é obrigatorio no body` })
    }

    const existe = await prisma.categoria.findUnique({
        where: { nome }
    })

    if (existe) {
        return res.status(409).json({ erro: `A categoria ${nome} ja existe` })
    }

    const categoria = await prisma.categoria.create({
        data: { nome }
    })

    return res.status(201).json(categoria)
})

app.delete('/categorias/:id', async (req, res) => {
    const id = idValido(req.params.id)

    if (!id) {
        return res.status(400).json({ erro: `Id invalido` })
    }

    const categoria = await prisma.categoria.delete({
        where: { id }
    })

    return res.status(200).json(categoria)
})

// Rotas para o Produto

app.get('/produtos', async (req, res) => {
    const { min, max } = req.query

    const preco = {}

    if (min !== undefined) {
        if (min === '' || !Number.isFinite(Number(min))) {
            return res.status(400).json({ erro: `min deve ser um numero` })
        }
        preco.gte = Number(min)
    }

    if (max !== undefined) {
        if (max === '' || !Number.isFinite(Number(max))) {
            return res.status(400).json({ erro: `max deve ser um numero` })
        }
        preco.lte = Number(max)
    }

    const produtos = await prisma.produto.findMany({
        where: Object.keys(preco).length ? { preco } : {},
        include: { categoria: true },
        orderBy: { id: 'asc' }
    })

    return res.status(200).json(produtos)
})

app.get('/produtos/:id', async (req, res) => {
    const id = idValido(req.params.id)

    if (!id) {
        return res.status(400).json({ erro: `Id invalido` })
    }

    const produto = await prisma.produto.findUnique({
        where: { id },
        include: { categoria: true }
    })

    if (!produto) {
        return res.status(404).json({ erro: `Id nao encontrado` })
    }

    return res.status(200).json(produto)
})

app.post('/produtos', async (req, res) => {
    const { nome, preco, categoriaId } = req.body ?? {}

    if (typeof nome !== 'string' || !nome.trim() || preco === undefined || categoriaId === undefined) {
        return res.status(400).json({ erro: `Os campos nome, preco e categoriaId são obrigatorios` })
    }

    if (!precoValido(preco)) {
        return res.status(400).json({ erro: `O preço deve ser um numero maior que 0` })
    }

    if (!idValido(categoriaId) || typeof categoriaId !== 'number') {
        return res.status(400).json({ erro: `categoriaId invalido` })
    }

    const categoria = await prisma.categoria.findUnique({
        where: { id: categoriaId }
    })

    if (!categoria) {
        return res.status(404).json({ erro: `Categoria nao encontrada` })
    }

    const produto = await prisma.produto.create({
        data: { nome, preco, categoriaId }
    })

    return res.status(201).json(produto)
})

app.put('/produtos/:id', async (req, res) => {
    const id = idValido(req.params.id)

    if (!id) {
        return res.status(400).json({ erro: `Id invalido` })
    }

    const { preco } = req.body ?? {}

    if (preco === undefined) {
        return res.status(400).json({ erro: `O campo preco é obrigatorio` })
    }

    if (!precoValido(preco)) {
        return res.status(400).json({ erro: `O preço deve ser um numero maior que 0` })
    }

    const produto = await prisma.produto.update({
        where: { id },
        data: { preco }
    })

    return res.status(200).json(produto)
})

app.delete('/produtos/:id', async (req, res) => {
    const id = idValido(req.params.id)

    if (!id) {
        return res.status(400).json({ erro: `Id inválido` })
    }

    const produto = await prisma.produto.delete({
        where: { id }
    })

    return res.status(200).json(produto)
})

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ erro: `JSON invalido no body` })
    }

    if (err.code === 'P2025') {
        return res.status(404).json({ erro: `Id nao encontrado` })
    }

    if (err.code === 'P2002') {
        return res.status(409).json({ erro: `Registro com esse nome ja existe` })
    }

    if (err.code === 'P2003') {
        return res.status(409).json({ erro: `Operacao bloqueada por registros relacionados` })
    }

    console.error(err)
    return res.status(500).json({ erro: `Erro interno do servidor` })
})

const porta = process.env.PORT ?? 3000

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
})