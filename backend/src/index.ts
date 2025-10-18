import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { Pool } from 'pg'
import authRoutes from './routes/auth'
import pageRoutes from './routes/pages'
import contentRoutes from './routes/content'
import siteConfigRoutes from './routes/siteConfig'
import mediaRoutes from './routes/media'

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 3001

// Database connection
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'runic_cms',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack)
  } else {
    console.log('✓ Database connected successfully')
    release()
  }
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/pages', pageRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/site-config', siteConfigRoutes)
app.use('/api/media', mediaRoutes)

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  })
})

// Start server
app.listen(port, () => {
  console.log(`✓ Server running on port ${port}`)
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
