import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { pool } from '../index'
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// Get site configuration (public)
router.get('/public', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM site_config LIMIT 1')
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Site configuration not found' })
    }

    const config = result.rows[0]
    // Remove sensitive data for public access
    delete config.custom_js
    
    res.json({ config })
  } catch (error) {
    console.error('Error fetching site config:', error)
    res.status(500).json({ error: 'Failed to fetch site configuration' })
  }
})

// Get site configuration (admin)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM site_config LIMIT 1')
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Site configuration not found' })
    }

    res.json({ config: result.rows[0] })
  } catch (error) {
    console.error('Error fetching site config:', error)
    res.status(500).json({ error: 'Failed to fetch site configuration' })
  }
})

// Update site configuration
router.put(
  '/',
  authenticateToken,
  requireAdmin,
  [
    body('site_name').optional().notEmpty().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const {
        site_name,
        logo,
        favicon,
        theme,
        navigation,
        footer,
        custom_css,
        custom_js,
      } = req.body

      // Build update query dynamically
      const updates: string[] = []
      const values: any[] = []
      let paramCount = 1

      if (site_name !== undefined) {
        updates.push(`site_name = $${paramCount}`)
        values.push(site_name)
        paramCount++
      }
      if (logo !== undefined) {
        updates.push(`logo = $${paramCount}`)
        values.push(logo)
        paramCount++
      }
      if (favicon !== undefined) {
        updates.push(`favicon = $${paramCount}`)
        values.push(favicon)
        paramCount++
      }
      if (theme !== undefined) {
        updates.push(`theme = $${paramCount}`)
        values.push(JSON.stringify(theme))
        paramCount++
      }
      if (navigation !== undefined) {
        updates.push(`navigation = $${paramCount}`)
        values.push(JSON.stringify(navigation))
        paramCount++
      }
      if (footer !== undefined) {
        updates.push(`footer = $${paramCount}`)
        values.push(JSON.stringify(footer))
        paramCount++
      }
      if (custom_css !== undefined) {
        updates.push(`custom_css = $${paramCount}`)
        values.push(custom_css)
        paramCount++
      }
      if (custom_js !== undefined) {
        updates.push(`custom_js = $${paramCount}`)
        values.push(custom_js)
        paramCount++
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' })
      }

      // Get the first (and should be only) site config
      const configResult = await pool.query('SELECT id FROM site_config LIMIT 1')
      
      if (configResult.rows.length === 0) {
        return res.status(404).json({ error: 'Site configuration not found' })
      }

      const configId = configResult.rows[0].id
      values.push(configId)

      const result = await pool.query(
        `UPDATE site_config SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`,
        values
      )

      res.json({ config: result.rows[0] })
    } catch (error) {
      console.error('Error updating site config:', error)
      res.status(500).json({ error: 'Failed to update site configuration' })
    }
  }
)

export default router
