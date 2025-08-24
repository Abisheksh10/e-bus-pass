import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import BusPass from '../models/BusPass.js'
import { authRequired, adminOnly } from '../middleware/AuthMiddleware.js'
import { buildPassPdf } from '../utils/PassPdf.js'

const router = Router()

// Create registration (student only)
router.post('/',
  authRequired,
  body('fname').notEmpty(),
  body('lname').notEmpty(),
  body('year').notEmpty(),
  body('branch').notEmpty(),
  body('phno').notEmpty(),
  body('address').notEmpty(),
  body('rollno').notEmpty(),
  body('datevalid').notEmpty(),
  body('source').notEmpty(),
  body('destination').notEmpty(),
  body('passType').isIn(['weekly','monthly','yearly']),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const exists = await BusPass.findOne({ rollno: req.body.rollno })
      if (exists) return res.status(409).json({ message: 'A pass for this roll number already exists' })

      const pass = await BusPass.create({
        ...req.body,
        createdBy: req.user?.id || null
      })
      return res.status(201).json(pass)
    } catch (e) {
      return res.status(400).json({ message: e.message })
    }
  }
)

// List registrations (admin)
router.get('/', authRequired, adminOnly, async (_req, res) => {
  const list = await BusPass.find().sort({ createdAt: -1 })
  return res.json(list)
})

// Search by rollno for "View/Download Pass"
router.post('/search', async (req, res) => {
  const { rollno } = req.body
  const pass = await BusPass.findOne({ rollno })
  if (!pass) return res.json({ code: 'NOT_FOUND' })
  if (!pass.isAvailable) return res.json({ code: 'NOT_VERIFIED' })
  return res.json({ code: 'OK', data: pass })
})

// Renewal preview
router.post('/renew', async (req, res) => {
  const { rollno } = req.body
  const pass = await BusPass.findOne({ rollno })
  if (!pass) return res.status(404).json({ message: 'No record for roll number' })

  const dv = pass.datevalid || ''
  const mm = dv.slice(0,2)
  const yyyy = dv.slice(2,6)
  let year = parseInt(yyyy || '0', 10)
  if (!Number.isFinite(year)) year = new Date().getFullYear()
  const next = mm + String(year + 1)
  return res.json({ current: pass.datevalid, nextValidTill: next, data: pass })
})

// Accept (admin)
router.post('/:id/accept', authRequired, adminOnly, async (req, res) => {
  const updated = await BusPass.findByIdAndUpdate(req.params.id, { isAvailable: true }, { new: true })
  if (!updated) return res.status(404).json({ message: 'Not found' })
  return res.json(updated)
})

// Reject/Delete (admin)
router.delete('/:id', authRequired, adminOnly, async (req, res) => {
  const del = await BusPass.findByIdAndDelete(req.params.id)
  if (!del) return res.status(404).json({ message: 'Not found' })
  return res.json({ ok: true })
})


// Download printable PDF of a pass (approved or pending).
// If you want to restrict to approved only, add a check for pass.isAvailable === true.
router.get('/:id/pdf', async (req, res) => {
  const pass = await BusPass.findById(req.params.id)
  if (!pass) return res.status(404).json({ message: 'Pass not found' })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename=BusPass_${pass.rollno}.pdf`)

  const doc = await buildPassPdf(pass)
  doc.pipe(res)
  doc.end()
})

export default router
