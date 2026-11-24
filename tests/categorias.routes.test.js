import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'

vi.mock('../src/lib/prisma.js')

const tokenAdmin = jwt.sign({ id: 1, papel: 'ADMIN' }, process.env.JWT_SECRET)

beforeEach(() => {
  vi.resetAllMocks()
})

describe('POST /categorias', () => {
  it('responde 409 quando o nome já existe', async () => {
    prisma.categoria.create.mockRejectedValue(
      Object.assign(new Error('duplicado'), { code: 'P2002' }),
    )

    const resposta = await request(app)
      .post('/categorias')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ nome: 'Eletrônicos' })

    expect(resposta.status).toBe(409)
  })
})
