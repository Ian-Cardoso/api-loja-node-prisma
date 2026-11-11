import { z } from 'zod'

export const idParamSchema = z.object({
    id: z.coerce.number('O id deve ser um número')
    .int('O id deve ser um número inteiro')
    .positive('O id deve ser maior que zero'),
})

export const criarCategoriaSchema = z.object({
    nome: z.string('O nome é obrigatório').trim().min(1, 'O nome não pode ser vazio'),
})

export const atualizarCategoriaSchema = z.object({
    nome: z.string().trim().min(1, 'O nome não pode ser vazio'),
})
.partial().refine(dados => Object.keys(dados).length > 0, 'Envie pelo menos um campo: nome')
