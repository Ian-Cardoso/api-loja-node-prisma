import { prisma } from '../src/lib/prisma.js'
import bcrypt from 'bcryptjs'

const senhaHash = await bcrypt.hash(process.env.ADMIN_SENHA, 10)

await prisma.usuario.upsert({
  where: { email: process.env.ADMIN_EMAIL },
  update: {},
  create: {
    nome: 'Administrador',
    email: process.env.ADMIN_EMAIL,
    senha: senhaHash,
    papel: 'ADMIN',
  },
})

const categorias = [
    {
        nome: 'Eletrônicos',
        produtos: [
            { nome: 'Mouse sem fio', preco: 59.9 },
            { nome: 'Teclado mecânico', preco: 249.9 },
            { nome: 'Fone de ouvido', preco: 129.9 }
        ]
    },
    {
        nome: 'Livros',
        produtos: [
            { nome: 'Clean Code', preco: 89.9 },
            { nome: 'JavaScript: O Guia Definitivo', preco: 139.9 }
        ]
    },
    {
        nome: 'Papelaria',
        produtos: [
            { nome: 'Caderno 200 folhas', preco: 24.5 },
            { nome: 'Caneta esferográfica', preco: 3.5 }
        ]
    }
]

for (const { nome, produtos } of categorias) {
    await prisma.categoria.upsert({
        where: { nome },
        update: {},
        create: {
            nome,
            produtos: { create: produtos }
        }
    })
}

console.log('Seed concluido')
await prisma.$disconnect()
