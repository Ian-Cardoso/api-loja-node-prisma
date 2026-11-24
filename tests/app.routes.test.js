import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.js'

describe('rota inexistente', () => {
  it('GET /rota-que-nao-existe responde 404', async () => {
    const resposta = await request(app).get('/rota-que-nao-existe')

    expect(resposta.status).toBe(404)
    expect(resposta.body.erro).toBe('Rota não encontrada')
  })
})
