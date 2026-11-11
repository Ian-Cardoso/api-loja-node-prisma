import { z } from 'zod'

const email = z
.string('O e-mail é obrigatório')
  .trim()
  .toLowerCase()
  .pipe(z.email('E-mail inválido'))

export const cadastroSchema = z.object({
  nome: z.string('O nome é obrigatório').trim().min(1, 'O nome não pode ser vazio'),
  email,
  senha: z.string('A senha é obrigatória').min(8, 'A senha deve ter pelo menos 8 caracteres'),
})

export const loginSchema = z.object({
    email,
    senha: z.string('A senha é obrigatoria').min(1, 'A senha é obrigatoria')
})