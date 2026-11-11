import { z } from 'zod'

export const idParamSchema = z.object({
    id: z.coerce.number('O id deve ser um número')
    .int('O id deve ser um número inteiro')
    .positive('O id deve ser maior que zero'),
})

export const listarProdutosSchema = z.object({
    precoMin: z.coerce.number('precoMin deve ser um número').optional(),
    precoMax: z.coerce.number('precoMax deve ser um número').optional(),
})

export const criarProdutoSchema = z.object({
    nome: z.string('O nome é obrigatório').trim().min(1, 'O nome não pode ser vazio'),
    preco: z.coerce.number('O preço é obrigatório').positive('O preço deve ser maior que zero'),
    categoriaId: z.coerce.number('A categoria é obrigatória').int('O id da categoria deve ser inteiro').positive('O id da categoria deve ser maior que zero'),
})

export const atualizarProdutoSchema = z.object({
    nome: z.string().trim().min(1, 'O nome não pode ser vazio'),
    preco: z.coerce.number().positive('O preço deve ser maior que zero'),
    categoriaId: z.coerce.number().int('O id da categoria deve ser inteiro').positive('O id da categoria deve ser maior que zero'),
})
.partial().refine(dados => Object.keys(dados).length > 0, 'Envie pelo menos um campo: nome, preco ou categoriaId')
