import * as authService from '../services/auth.service.js'
import { cadastroSchema, loginSchema } from '../schemas/auth.schema.js'

export async function cadastrar(req, res) {
  const dados = cadastroSchema.parse(req.body ?? {})
  const usuario = await authService.cadastrar(dados)
  return res.status(201).json(usuario)
}

export async function login(req, res) {
  const dados = loginSchema.parse(req.body ?? {})
  const resultado = await authService.login(dados)
  return res.json(resultado)
}

export async function perfil(req, res) {
  const usuario = await authService.buscarPerfil(req.usuario.id)
  return res.json(usuario)
}