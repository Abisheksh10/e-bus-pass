import { useState } from 'react'
import api from '../../services/api'
import { CalendarRange, Search, ArrowRight, Info } from 'lucide-react'

export default function RenewPass(){
  const [rollno, setRollno] = useState('')
  const [info, setInfo] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e){
    e.preventDefault()
    setErr('')
    setInfo(null)
    if (!rollno.trim()) {
      setErr('Please enter your Roll Number.')
      return
    }
    setBusy(true)
    try {
      const { data } = await api.post('/passes/renew', { rollno })
      setInfo(data)   // expected: { current, nextValidTill, data: {...pass...} }
    } catch (e) {
      setErr(e?.response?.data?.message || 'Could not fetch renewal info')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
      <h1 className="text-2xl font-semibold mb-1 flex items-center gap-2">
        <CalendarRange className="h-6 w-6 text-blue-700" /> Renewal
      </h1>
      <p className="text-gray-600 mb-4">
        Check your current validity and preview the next renewal period by entering your Roll Number.
      </p>

      {err && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
          {err}
        </div>
      )}

      <form onSubmit={submit} className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          placeholder="College Roll Number"
          value={rollno}
          onChange={e => setRollno(e.target.value)}
        />
        <button
          disabled={busy}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2 disabled:opacity-60"
        >
          <Search className="h-4 w-4" /> Check
        </button>
      </form>

      {info && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-700 mt-0.5" />
            <div className="space-y-1">
              <div><b>Current Valid Till:</b> {info.current || '—'}</div>
              <div><b>Next Valid Till:</b> {info.nextValidTill || '—'}</div>
              {info.data && (
                <div className="text-sm text-gray-600 pt-1">
                  <div><b>Name:</b> {info.data.fname} {info.data.lname}</div>
                  <div><b>Route:</b> {info.data.route}</div>
                  <div><b>Roll Number:</b> {info.data.rollno}</div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Renewing soon? You can re-apply from the Registration page when your pass nears expiry.
          </div>
        </div>
      )}
    </div>
  )
}
