import { Router, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { pool } from '../index'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|mp4|webm|pdf|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
})

// Get all media
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM media ORDER BY created_at DESC'
    )
    res.json({ media: result.rows })
  } catch (error) {
    console.error('Error fetching media:', error)
    res.status(500).json({ error: 'Failed to fetch media' })
  }
})

// Upload media
router.post('/upload', authenticateToken, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const { alt_text, caption } = req.body
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001'
    const url = `${baseUrl}/uploads/${req.file.filename}`

    const result = await pool.query(
      'INSERT INTO media (filename, original_filename, mime_type, size, url, alt_text, caption, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        url,
        alt_text || '',
        caption || '',
        req.user!.id
      ]
    )

    res.status(201).json({ media: result.rows[0] })
  } catch (error) {
    console.error('Error uploading media:', error)
    res.status(500).json({ error: 'Failed to upload media' })
  }
})

// Update media metadata
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { alt_text, caption } = req.body

    const result = await pool.query(
      'UPDATE media SET alt_text = $1, caption = $2 WHERE id = $3 RETURNING *',
      [alt_text, caption, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Media not found' })
    }

    res.json({ media: result.rows[0] })
  } catch (error) {
    console.error('Error updating media:', error)
    res.status(500).json({ error: 'Failed to update media' })
  }
})

// Delete media
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM media WHERE id = $1 RETURNING filename',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Media not found' })
    }

    // Delete physical file
    const uploadDir = process.env.UPLOAD_DIR || './uploads'
    const filePath = path.join(uploadDir, result.rows[0].filename)
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    res.json({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Error deleting media:', error)
    res.status(500).json({ error: 'Failed to delete media' })
  }
})

export default router
