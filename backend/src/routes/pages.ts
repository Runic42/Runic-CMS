import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { pool } from '../index'
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all pages (public - only published)
router.get('/public', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, title, slug, seo, created_at, updated_at FROM pages WHERE is_published = true ORDER BY updated_at DESC'
    )
    res.json({ pages: result.rows })
  } catch (error) {
    console.error('Error fetching pages:', error)
    res.status(500).json({ error: 'Failed to fetch pages' })
  }
})

// Get all pages (admin - including drafts)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, title, slug, is_published, created_at, updated_at FROM pages ORDER BY updated_at DESC'
    )
    res.json({ pages: result.rows })
  } catch (error) {
    console.error('Error fetching pages:', error)
    res.status(500).json({ error: 'Failed to fetch pages' })
  }
})

// Get single page by slug (public)
router.get('/public/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const result = await pool.query(
      'SELECT * FROM pages WHERE slug = $1 AND is_published = true',
      [slug]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' })
    }

    res.json({ page: result.rows[0] })
  } catch (error) {
    console.error('Error fetching page:', error)
    res.status(500).json({ error: 'Failed to fetch page' })
  }
})

// Get single page by ID (admin)
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM pages WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' })
    }

    res.json({ page: result.rows[0] })
  } catch (error) {
    console.error('Error fetching page:', error)
    res.status(500).json({ error: 'Failed to fetch page' })
  }
})

// Create new page
router.post(
  '/',
  authenticateToken,
  [
    body('title').notEmpty().trim(),
    body('slug').notEmpty().trim().isSlug(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { title, slug, content = [], seo = {}, custom_html = '', is_published = false } = req.body

      // Check if slug already exists
      const existing = await pool.query('SELECT id FROM pages WHERE slug = $1', [slug])
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Slug already exists' })
      }

      const result = await pool.query(
        'INSERT INTO pages (title, slug, content, seo, custom_html, is_published, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, slug, JSON.stringify(content), JSON.stringify(seo), custom_html, is_published, req.user!.id]
      )

      res.status(201).json({ page: result.rows[0] })
    } catch (error) {
      console.error('Error creating page:', error)
      res.status(500).json({ error: 'Failed to create page' })
    }
  }
)

// Update page
router.put(
  '/:id',
  authenticateToken,
  [
    body('title').optional().notEmpty().trim(),
    body('slug').optional().notEmpty().trim().isSlug(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { id } = req.params
      const { title, slug, content, seo, custom_html, is_published } = req.body

      // Check if page exists
      const existing = await pool.query('SELECT id FROM pages WHERE id = $1', [id])
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Page not found' })
      }

      // If slug is being changed, check for conflicts
      if (slug) {
        const slugCheck = await pool.query(
          'SELECT id FROM pages WHERE slug = $1 AND id != $2',
          [slug, id]
        )
        if (slugCheck.rows.length > 0) {
          return res.status(400).json({ error: 'Slug already exists' })
        }
      }

      // Build update query dynamically
      const updates: string[] = []
      const values: any[] = []
      let paramCount = 1

      if (title !== undefined) {
        updates.push(`title = $${paramCount}`)
        values.push(title)
        paramCount++
      }
      if (slug !== undefined) {
        updates.push(`slug = $${paramCount}`)
        values.push(slug)
        paramCount++
      }
      if (content !== undefined) {
        updates.push(`content = $${paramCount}`)
        values.push(JSON.stringify(content))
        paramCount++
      }
      if (seo !== undefined) {
        updates.push(`seo = $${paramCount}`)
        values.push(JSON.stringify(seo))
        paramCount++
      }
      if (custom_html !== undefined) {
        updates.push(`custom_html = $${paramCount}`)
        values.push(custom_html)
        paramCount++
      }
      if (is_published !== undefined) {
        updates.push(`is_published = $${paramCount}`)
        values.push(is_published)
        paramCount++
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' })
      }

      values.push(id)
      const result = await pool.query(
        `UPDATE pages SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`,
        values
      )

      res.json({ page: result.rows[0] })
    } catch (error) {
      console.error('Error updating page:', error)
      res.status(500).json({ error: 'Failed to update page' })
    }
  }
)

// Delete page
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const result = await pool.query('DELETE FROM pages WHERE id = $1 RETURNING id', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' })
    }

    res.json({ message: 'Page deleted successfully', id: result.rows[0].id })
  } catch (error) {
    console.error('Error deleting page:', error)
    res.status(500).json({ error: 'Failed to delete page' })
  }
})

// Export page as HTML
router.get('/:id/export', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM pages WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' })
    }

    const page = result.rows[0]
    
    // Get site config for styling
    const configResult = await pool.query('SELECT * FROM site_config LIMIT 1')
    const config = configResult.rows[0] || {}

    // Generate HTML
    const html = generateStaticHTML(page, config)

    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Disposition', `attachment; filename="${page.slug}.html"`)
    res.send(html)
  } catch (error) {
    console.error('Error exporting page:', error)
    res.status(500).json({ error: 'Failed to export page' })
  }
})

// Helper function to generate static HTML
function generateStaticHTML(page: any, config: any): string {
  const theme = config.theme || {}
  const content = page.content || []

  let contentHTML = ''
  
  // Render custom HTML if available
  if (page.custom_html) {
    contentHTML = page.custom_html
  } else {
    // Generate HTML from content objects
    contentHTML = content.map((obj: any) => {
      switch (obj.type) {
        case 'text':
          return `<div class="text-content" style="padding: ${obj.styling?.padding?.top || 0}px ${obj.styling?.padding?.right || 0}px ${obj.styling?.padding?.bottom || 0}px ${obj.styling?.padding?.left || 0}px; font-size: ${obj.styling?.fontSize || 16}px; color: ${obj.styling?.color || '#000'}; text-align: ${obj.styling?.alignment || 'left'};">${obj.content || ''}</div>`
        case 'gallery':
          const images = obj.images?.map((img: any) => 
            `<img src="${img.url}" alt="${img.alt || ''}" style="max-width: 100%; height: auto;" />`
          ).join('') || ''
          return `<div class="gallery">${images}</div>`
        case 'video':
          return `<video src="${obj.url}" controls ${obj.autoplay ? 'autoplay' : ''} ${obj.loop ? 'loop' : ''} ${obj.muted ? 'muted' : ''} style="max-width: 100%;"></video>`
        case 'youtube':
          return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${obj.videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        case 'embed':
          return obj.embedCode || ''
        default:
          return ''
      }
    }).join('\n')
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.seo?.title || page.title}</title>
  <meta name="description" content="${page.seo?.description || ''}">
  <meta name="keywords" content="${page.seo?.keywords?.join(', ') || ''}">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: ${theme.fontFamily || 'Arial, sans-serif'};
      color: ${theme.textColor || '#000'};
      background-color: ${theme.backgroundColor || '#fff'};
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    ${config.custom_css || ''}
  </style>
</head>
<body>
  <div class="container">
    <h1>${page.title}</h1>
    ${contentHTML}
  </div>
  ${config.custom_js ? `<script>${config.custom_js}</script>` : ''}
</body>
</html>`
}

export default router
