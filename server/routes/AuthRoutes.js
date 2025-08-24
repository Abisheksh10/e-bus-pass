import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import Registration from '../models/Registration.js'
import Admin from '../models/Admin.js'

const router = Router()

router.post('/register',
  body('username').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { username, email, password } = req.body
    const exists = await Registration.findOne({ email })
    if (exists) return res.status(409).json({ message: 'User already exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = await Registration.create({ username, email, password: hash })
    return res.status(201).json({ id: user._id, email: user.email })
  }
)

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await Registration.findOne({ email })
  if (!user) return res.status(404).json({ message: 'User not found' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7*24*60*60*1000 })
  return res.json({ message: 'Logged in', role: user.role })
})

router.post('/admin/login', async (req, res) => {
  const { mail, password } = req.body
  const admin = await Admin.findOne({ mail })
  if (!admin) return res.status(404).json({ message: 'Admin not found' })
  const ok = await bcrypt.compare(password, admin.password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ id: admin._id, role: 'admin', email: admin.mail }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7*24*60*60*1000 })
  return res.json({ message: 'Admin logged in' })
})

router.post('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({ message: 'Logged out' })
})

router.get('/me', (req, res) => {
  try {
    const token = req.cookies?.token
    if (!token) return res.json({ user: null })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return res.json({ user: decoded })
  } catch {
    return res.json({ user: null })
  }
})

export default router
