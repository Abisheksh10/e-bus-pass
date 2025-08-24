import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarRange, MapPin, CreditCard, FileSignature, Phone, User, GraduationCap, BusFront } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { LOCATIONS, calculateFareINR } from '../../utils/locations'

const YEARS = ['I','II','III','IV']
const BRANCHES = ['CSE','IT','ECE','EEE','MECH','CIVIL','AIML','AIDS','CSBS']

export default function RegisterPass(){
  const { user } = useAuth()
  const nav = useNavigate()

  // Basic student/application fields
  const [form, setForm] = useState({
    fname: '', lname: '', year: '', branch: '',
    busno: '', phno: '', address: '',
    rollno: '', datevalid: '', // e.g. MMYYYY
    source: '', destination: '',
    passType: 'monthly',
  })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  function set(k,v){ setForm(p => ({...p, [k]: v})) }

  // Compute price based on src/dst + pass type
  const fare = useMemo(() => {
    if (!form.source || !form.destination || form.source === form.destination) {
      return { km: 0, priceINR: 0, zoneMonthly: 0 }
    }
    return calculateFareINR(form.source, form.destination, form.passType)
  }, [form.source, form.destination, form.passType])

  useEffect(() => {
    // If user not logged in, guard (safety net; also use ProtectedRoute in routes)
    if (!user) {
      nav('/login', { replace: true })
    }
  }, [user, nav])

  async function submit(e){
    e.preventDefault()
    setErr('')
    if (!fare.priceINR || !form.source || !form.destination || form.source === form.destination) {
      setErr('Please choose a valid source & destination.')
      return
    }
    setBusy(true)
    try {
      // Create pass application with computed fare
      const payload = {
        ...form,
        route: `${form.source} → ${form.destination}`,
        priceINR: fare.priceINR,
        distanceKm: fare.km,
        isAvailable: false,
      }
      const { data } = await api.post('/passes', payload)

      // Proceed to Stripe Checkout with dynamic amount (in paise)
      const amountPaise = fare.priceINR * 100
      const checkout = await api.post('/payments/create-checkout', {
        amountPaise,
        passId: data?._id, // backend can store metadata
        passType: form.passType,
        route: payload.route
      })
      if (checkout?.data?.url) {
        window.location = checkout.data.url
      } else {
        setErr('Could not start checkout.')
      }
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 shadow-sm border">
      <h1 className="text-2xl font-semibold mb-1 flex items-center gap-2">
        <BusFront className="h-6 w-6 text-blue-700" /> Registration for New Bus Pass
      </h1>
      <p className="text-gray-600 mb-4">Fill the form below to apply. You must be logged in.</p>
      {err && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</div>}

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="relative">
          <User className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <input className="w-full border rounded-md p-2 pl-9" placeholder="First name"
            value={form.fname} onChange={e=>set('fname', e.target.value)} required />
        </div>
        <div className="relative">
          <User className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <input className="w-full border rounded-md p-2 pl-9" placeholder="Last name"
            value={form.lname} onChange={e=>set('lname', e.target.value)} required />
        </div>

        {/* Academic */}
        <div className="relative">
          <GraduationCap className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <select className="w-full border rounded-md p-2 pl-9" value={form.year}
            onChange={e=>set('year', e.target.value)} required>
            <option value="">Year</option>
            {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="relative">
          <GraduationCap className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <select className="w-full border rounded-md p-2 pl-9" value={form.branch}
            onChange={e=>set('branch', e.target.value)} required>
            <option value="">Branch</option>
            {BRANCHES.map(b=><option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Contact */}
        <div className="relative">
          <Phone className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <input className="w-full border rounded-md p-2 pl-9" placeholder="Phone"
            value={form.phno} onChange={e=>set('phno', e.target.value)} required />
        </div>
        <div className="relative md:col-span-2">
          <FileSignature className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <input className="w-full border rounded-md p-2 pl-9" placeholder="Address"
            value={form.address} onChange={e=>set('address', e.target.value)} required />
        </div>

        {/* Student IDs */}
        <div className="relative">
          <FileSignature className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <input className="w-full border rounded-md p-2 pl-9" placeholder="College Roll Number"
            value={form.rollno} onChange={e=>set('rollno', e.target.value)} required />
        </div>
        <div className="relative">
          <CalendarRange className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <input className="w-full border rounded-md p-2 pl-9" placeholder="Validity (MMYYYY)"
            value={form.datevalid} onChange={e=>set('datevalid', e.target.value)} required />
        </div>

        {/* Route */}
        <div className="relative">
          <MapPin className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <select className="w-full border rounded-md p-2 pl-9" value={form.source}
            onChange={e=>set('source', e.target.value)} required>
            <option value="">Source (Chennai)</option>
            {LOCATIONS.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
          </select>
        </div>
        <div className="relative">
          <MapPin className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <select className="w-full border rounded-md p-2 pl-9" value={form.destination}
            onChange={e=>set('destination', e.target.value)} required>
            <option value="">Destination (Chennai)</option>
            {LOCATIONS.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
          </select>
        </div>

        {/* Pass type */}
        <div className="relative">
          <CreditCard className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <select className="w-full border rounded-md p-2 pl-9" value={form.passType}
            onChange={e=>set('passType', e.target.value)} required>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Bus number (optional/manual; can be assigned by admin later) */}
        <div className="relative">
          <BusFront className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <input className="w-full border rounded-md p-2 pl-9" placeholder="Bus Number (optional)"
            value={form.busno} onChange={e=>set('busno', e.target.value)} />
        </div>

        {/* Fare summary */}
        <div className="md:col-span-2 border rounded-lg p-4 bg-gray-50">
          <div className="flex flex-wrap gap-6 items-center">
            <div><b>Distance:</b> {fare.km} km</div>
            <div><b>Pass Type:</b> {form.passType[0].toUpperCase() + form.passType.slice(1)}</div>
            <div><b>Price:</b> ₹ {fare.priceINR}</div>
          </div>
        </div>

        <button
          disabled={busy || !fare.priceINR}
          className="md:col-span-2 justify-self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  )
}
