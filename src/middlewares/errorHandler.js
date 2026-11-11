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

  if (err.code === 'P2002') {
    return res.status(409).json({ erro: 'Já existe um registro com esse nome' })
  }

  if (err.code === 'P2003') {
    return res.status(409).json({ erro: 'Operação viola uma relação (ex.: categoria com produtos ou categoria inexistente)' })
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ erro: 'Registro não encontrado' })
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no body' })
  }

  console.error(err)
  return res.status(500).json({ erro: 'Erro interno do servidor' })
}