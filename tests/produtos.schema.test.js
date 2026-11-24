import { describe, it, expect } from 'vitest'
import { criarProdutoSchema } from '../src/schemas/produtos.schema.js'

describe('criarProdutoSchema', () => {
  it('aceita um produto válido e remove os espaços do nome', () => {
    const resultado = criarProdutoSchema.safeParse({
      nome: '  Mouse  ',
      preco: 59.9,
      categoriaId: 1,
    })

    expect(resultado.success).toBe(true)
    expect(resultado.data.nome).toBe('Mouse')
  })

  it('recusa preço zero', () => {
    const resultado = criarProdutoSchema.safeParse({ nome: 'Mouse', preco: 0, categoriaId: 1 })
    expect(resultado.success).toBe(false)
  })

  it('recusa preço que não é número', () => {
    const resultado = criarProdutoSchema.safeParse({ nome: 'Mouse', preco: true, categoriaId: 1 })
    expect(resultado.success).toBe(false)
  })
})