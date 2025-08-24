import api from '../../services/api'
import { CreditCard } from 'lucide-react'

export default function Checkout(){
  async function go(){
    // Fallback: example fixed amount; in our registration flow we already send dynamic amount
    const { data } = await api.post('/payments/create-checkout', { amountPaise: 50000 })
    if (data?.url) window.location = data.url
  }
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-sm border text-center">
      <h1 className="text-xl font-semibold mb-4 inline-flex items-center gap-2">
        <CreditCard className="h-6 w-6 text-blue-700" /> Payment
      </h1>
      <p className="mb-4 text-gray-700">Proceed to Stripe checkout to complete your payment.</p>
      <button onClick={go} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Pay Now
      </button>
    </div>
  )
}
