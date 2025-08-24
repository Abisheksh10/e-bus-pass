import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import Driver from '../models/Driver.js'
import { authRequired, adminOnly } from '../middleware/AuthMiddleware.js'

const router = Router()

// Public: list drivers (your original app showed driver details publicly)
router.get('/', async (_req, res) => {
  const list = await Driver.find().sort({ createdAt: -1 })
  return res.json(list)
})

// Admin: create
router.post('/',
  authRequired, adminOnly,
  body('id').notEmpty(),
  body('name').notEmpty(),
  body('phone').notEmpty(),
  body('busno').notEmpty(),
  body('route').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
      const exists = await Driver.findOne({ id: req.body.id })
      if (exists) return res.status(409).json({ message: 'Driver ID already exists' })
      const driver = await Driver.create(req.body)
      return res.status(201).json(driver)
    } catch (e) {
      return res.status(400).json({ message: e.message })
    }
  }
)

// Admin: update
router.put('/:id', authRequired, adminOnly, async (req, res) => {
  const d = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!d) return res.status(404).json({ message: 'Not found' })
  return res.json(d)
})

// Admin: delete
router.delete('/:id', authRequired, adminOnly, async (req, res) => {
  const d = await Driver.findByIdAndDelete(req.params.id)
  if (!d) return res.status(404).json({ message: 'Not found' })
  return res.json({ ok: true })
})

export default router
