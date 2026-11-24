import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'

vi.mock('../src/lib/prisma.js')

const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET)

beforeEach(() => {
  vi.resetAllMocks()
})

describe('GET /produtos/:id', () => {
  it('responde 400 quando o id não é número', async () => {
    const resposta = await request(app).get('/produtos/abc')

    expect(resposta.status).toBe(400)
    expect(resposta.body.erro).toBe('Dados inválidos')
  })

  it('responde 404 quando o produto não existe', async () => {
    prisma.produto.findUnique.mockResolvedValue(null)

    const resposta = await request(app).get('/produtos/99')

    expect(resposta.status).toBe(404)
  })

  it('responde 200 com o produto', async () => {
    const mouse = { id: 1, nome: 'Mouse', preco: 59.9, categoriaId: 1 }
    prisma.produto.findUnique.mockResolvedValue(mouse)

    const resposta = await request(app).get('/produtos/1')

    expect(resposta.status).toBe(200)
    expect(resposta.body).toEqual(mouse)
  })
})

describe('POST /produtos', () => {
  const novoProduto = { nome: 'Fone', preco: 129.9, categoriaId: 1 }

  it('responde 401 sem token', async () => {
    const resposta = await request(app).post('/produtos').send(novoProduto)

    expect(resposta.status).toBe(401)
    expect(prisma.produto.create).not.toHaveBeenCalled()
  })

  it('responde 404 quando a categoria não existe', async () => {
    prisma.categoria.findUnique.mockResolvedValue(null)

    const resposta = await request(app)
      .post('/produtos')
      .set('Authorization', `Bearer ${token}`)
      .send(novoProduto)

    expect(resposta.status).toBe(404)
  })

  it('cria o produto e responde 201', async () => {
    prisma.categoria.findUnique.mockResolvedValue({ id: 1, nome: 'Eletrônicos' })
    prisma.produto.create.mockResolvedValue({ id: 10, ...novoProduto })

    const resposta = await request(app)
      .post('/produtos')
      .set('Authorization', `Bearer ${token}`)
      .send(novoProduto)

    expect(resposta.status).toBe(201)
    expect(resposta.body.id).toBe(10)
    expect(prisma.produto.create).toHaveBeenCalledWith({ data: { ...novoProduto, criadoPorId: 1 } })
  })
})

describe('PUT /produtos/:id', () => {
  it('responde 400 com body vazio', async () => {
    const resposta = await request(app)
      .put('/produtos/1')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(resposta.status).toBe(400)
    expect(resposta.body.erro).toBe('Dados inválidos')
  })
})

describe('DELETE /produtos/:id', () => {
  it('remove o produto do dono e responde 204', async () => {
    prisma.produto.findUnique.mockResolvedValue({ id: 1, nome: 'Mouse', criadoPorId: 1 })
    prisma.produto.delete.mockResolvedValue({ id: 1 })

    const resposta = await request(app)
      .delete('/produtos/1')
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(204)
    expect(prisma.produto.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })
})
