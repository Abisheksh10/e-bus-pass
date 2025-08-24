import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// routes
import AuthRoutes from './routes/AuthRoutes.js'
import PassesRoutes from './routes/PassesRoutes.js'
import DriversRoutes from './routes/DriversRoutes.js'
import PaymentsRoutes from './routes/PaymentsRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// mount API with EXACT spellings used in frontend
app.use('/api/auth', AuthRoutes)
app.use('/api/passes', PassesRoutes)
app.use('/api/drivers', DriversRoutes)
app.use('/api/payments', PaymentsRoutes)

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
  })
  .catch(err => {
    console.error('Mongo connection error:', err.message)
    process.exit(1)
  })
