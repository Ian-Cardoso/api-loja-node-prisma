import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../errors/AppError.js'
import { id } from "zod/locales";

function semSenha(usuario) {
    const { senha, ...resto } = usuario
    return resto
}

export async function cadastrar({ nome, email, senha }) {
    const existe = await prisma.usuario.findUnique({ where: { email }})
    if (existe) {
        throw new AppError(409, 'Ja existe um usuario com esse e-mail')
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const usuario = await prisma.usuario.create({
        data: { nome, email, senha: senhaHash}
    })

    return semSenha(usuario)
}

export async function login({ email, senha }) {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    const senhaConfere = usuario && (await bcrypt.compare(senha, usuario.senha))

    if (!senhaConfere) {
        throw new AppError(401, 'E-mail ou senha inválidos')
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1d'})

    return { token, usuario: semSenha(usuario)}
}

export async function buscarPerfil(id) {
    const usuario = await prisma.usuario.findUnique({ where: { id }})

    if (!usuario) {
        throw new AppError(404, 'Usuario não encontrado')
    }


    return semSenha(usuario)
}