import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { pool } from '../index'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    
    const decoded = jwt.verify(token, jwtSecret) as any

    // Check if session is still valid
    const sessionResult = await pool.query(
      'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
      [token]
    )

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Get user info
    const userResult = await pool.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.userId]
    )

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = userResult.rows[0]
    next()
  } catch (error) {
    console.error('Auth error:', error)
    return res.status(403).json({ error: 'Invalid token' })
  }
}

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}
