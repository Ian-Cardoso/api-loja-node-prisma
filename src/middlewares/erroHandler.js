import { ZodError } from 'zod'
import { AppError } from '../errors/AppError.js'

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: err.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensagem: issue.message,
      })),
    })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message })
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no body' })
  }

  console.error(err)
  return res.status(500).json({ erro: 'Erro interno do servidor' })
}