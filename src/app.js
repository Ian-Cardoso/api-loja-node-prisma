import express from 'express'
import categoriaRoutes from './routes/categoria.routes.js'
import produtoRoutes from './routes/produto.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'

export const app = express()

app.use(express.json())

app.use('/categorias', categoriaRoutes)
app.use('/produtos', produtoRoutes)

app.use((req, res) => {
  return res.status(404).json({ erro: 'Rota não encontrada' })
})

app.use(errorHandler)