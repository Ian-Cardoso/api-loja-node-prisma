import { object, z } from 'zod'

export const idParamSchema = z.object({
    id: z.coerce.number('O id deve ser um número')
    .int('O id deve ser um número inteiro')
    .positive('O numero deve ser maior que zero'),
})

export const listarProdutosSchema = z.object({
    categoriaId: z.string().trim().min(1).optional()
})

export const criarProdutoSchema = z.object({
    nome: z.string('O nome é obrigatorio').trim().min(1, 'O nome nao pode ser vazio'),
    preco: z.coerce.number('O preço é obrigatorio').trim().min(1, 'O preço nao pode ser vazio'),
    categoriaId: z.coerce.number('A categoria é obrigatorio').min(1, 'O id nao pode ser vazio'),
})

export const atualizarProdutoSchema = z.object({
    nome: z.string().trim().min(1, 'O nome não pode ser vazio'),
    preco: z.coerce.number().min(1, 'O preço não pode ser vazio'),
    categoriaId: z.coerce.number().min(1, 'A categoria não pode ser vazia')
})
.partial().refine(dados => Object.keys(dados).length > 0, 'Envie pelo menos um campo: nome,preco ou categoriaId')