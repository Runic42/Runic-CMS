import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { pool } from '../index'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()

// Register new user
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('username').isLength({ min: 3 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password, username } = req.body

      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        [email, username]
      )

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' })
      }

      // Hash password
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      // Insert new user
      const result = await pool.query(
        'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username, role',
        [email, passwordHash, username]
      )

      const user = result.rows[0]

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      })
    } catch (error) {
      console.error('Register error:', error)
      res.status(500).json({ error: 'Failed to register user' })
    }
  }
)

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const user = result.rows[0]

      // Check password
      const validPassword = await bcrypt.compare(password, user.password_hash)
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Create JWT token
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' })

      // Store session
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

      await pool.query(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, token, expiresAt]
      )

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Failed to login' })
    }
  }
)

// Logout
router.post('/logout', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      await pool.query('DELETE FROM sessions WHERE token = $1', [token])
    }

    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Failed to logout' })
  }
})

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user })
})

export default router
