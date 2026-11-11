import jwt from 'jsonwebtoken'
import { AppError } from '../errors/AppError.js'

export function autenticar(req, res, next) {
    const authorization = req.headers.authorization

    if (!authorization || !authorization.startsWith('Bearer')) {
        throw new AppError(401, 'Token não enviado')
    }

    const token = authorization.split(' ')[1]

    let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw new AppError(401, 'Token inválido ou expirado')
  }

  req.usuario = { id: payload.id }
  next()
}