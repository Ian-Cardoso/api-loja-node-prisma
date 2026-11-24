import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { app } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'

vi.mock('../src/lib/prisma.js')

beforeEach(() => {
  vi.resetAllMocks()
})

describe('POST /auth/cadastro', () => {
  it('salva a senha como hash e não devolve a senha', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    prisma.usuario.create.mockImplementation(async ({ data }) => ({ id: 1, ...data }))

    const resposta = await request(app)
      .post('/auth/cadastro')
      .send({ nome: 'Ian', email: 'ian@email.com', senha: '12345678' })

    expect(resposta.status).toBe(201)
    expect(resposta.body.senha).toBeUndefined()

    const senhaSalva = prisma.usuario.create.mock.calls[0][0].data.senha
    expect(senhaSalva).not.toBe('12345678')
    expect(await bcrypt.compare('12345678', senhaSalva)).toBe(true)
  })

  it('responde 409 quando o e-mail já existe', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ id: 1, email: 'ian@email.com' })

    const resposta = await request(app)
      .post('/auth/cadastro')
      .send({ nome: 'Ian', email: 'ian@email.com', senha: '12345678' })

    expect(resposta.status).toBe(409)
    expect(prisma.usuario.create).not.toHaveBeenCalled()
  })
})

describe('POST /auth/login', () => {
  it('responde 401 com a senha errada', async () => {
    const hash = await bcrypt.hash('senha-certa', 10)
    prisma.usuario.findUnique.mockResolvedValue({ id: 1, email: 'ian@email.com', senha: hash })

    const resposta = await request(app)
      .post('/auth/login')
      .send({ email: 'ian@email.com', senha: 'senha-errada' })

    expect(resposta.status).toBe(401)
    expect(resposta.body.token).toBeUndefined()
  })
})

describe('GET /auth/me', () => {
  const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET)

  it('responde 401 sem token', async () => {
    const resposta = await request(app).get('/auth/me')

    expect(resposta.status).toBe(401)
  })

  it('responde 200 com o perfil, sem a senha', async () => {
    prisma.usuario.findUnique.mockResolvedValue({
      id: 1,
      nome: 'Ian',
      email: 'ian@email.com',
      senha: 'hash-secreto',
    })

    const resposta = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(200)
    expect(resposta.body.email).toBe('ian@email.com')
    expect(resposta.body.senha).toBeUndefined()
  })
})
