import { Router } from 'express'
import Stripe from 'stripe'

const router = Router()

// Create Stripe Checkout Session
router.post('/create-checkout', async (req, res) => {
  try {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      console.error('Stripe error: Missing STRIPE_SECRET_KEY in .env')
      return res.status(500).json({ message: 'Stripe is not configured on the server (missing key)' })
    }
    const stripe = new Stripe(key)

    let { amountPaise, passId, passType, route } = req.body

    amountPaise = Number(amountPaise)
    if (!Number.isInteger(amountPaise) || amountPaise < 1000) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    // ...
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'inr',
        product_data: {
          name: `E-Bus Pass (${passType || 'monthly'})`,
          description: route || 'Bus pass'
        },
        unit_amount: amountPaise
      },
      quantity: 1
    }
  ],
  metadata: {
    passId: String(passId || ''),
    passType: String(passType || '')
  },
  success_url: (process.env.CLIENT_URL || 'http://localhost:5173') + '/payment/success',
  cancel_url: (process.env.CLIENT_URL || 'http://localhost:5173') + '/payment/checkout'
})

// ⬇️ Return BOTH id and url
return res.json({ id: session.id, url: session.url })

  } catch (e) {
    console.error('Stripe error:', e?.type || e?.name || 'Unknown', e?.message || e)
    return res.status(500).json({ message: 'Stripe error while creating checkout' })
  }
})

export default router
