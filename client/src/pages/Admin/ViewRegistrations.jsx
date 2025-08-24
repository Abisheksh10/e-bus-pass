import { useEffect, useState } from 'react'
import api from '../../services/api'
import { CheckCircle2, XCircle, RefreshCcw } from 'lucide-react'

export default function ViewRegistrations(){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  async function load(){
    setErr('')
    setLoading(true)
    try {
      const { data } = await api.get('/passes') // GET /api/passes
      setList(data || [])
    } catch (e) {
      setErr(e?.response?.data?.message || 'Could not load registrations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  async function accept(id){
    setErr('')
    try {
      await api.post(`/passes/${id}/accept`) // POST /api/passes/:id/accept
      await load()
    } catch (e) {
      setErr(e?.response?.data?.message || 'Accept failed')
    }
  }

  async function reject(id){
    setErr('')
    try {
      await api.delete(`/passes/${id}`) // DELETE /api/passes/:id
      await load()
    } catch (e) {
      setErr(e?.response?.data?.message || 'Reject failed')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Registrations</h1>
        <button onClick={load} className="inline-flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50">
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {err && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</div>}

      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : (
        <div className="space-y-2">
          {list.length === 0 && <div className="text-gray-600">No registrations found.</div>}
          {list.map(p => (
            <div key={p._id} className="bg-white p-4 rounded shadow-sm border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="font-medium">{p.fname} {p.lname} • {p.rollno}</div>
                <div className="text-sm text-gray-600">
                  {p.year} • {p.branch} • Route: {p.route} • Bus {p.busno || '—'}
                </div>
                <div className="text-xs mt-1">
                  Valid till <b>{p.datevalid}</b> • Status: {p.isAvailable ? <span className="text-green-700">Approved</span> : <span className="text-orange-700">Pending</span>}
                </div>
                {typeof p.priceINR === 'number' && (
                  <div className="text-xs mt-1 text-gray-700">Fare: ₹ {p.priceINR} {p.passType ? `• ${p.passType}` : ''} {p.distanceKm ? `• ${p.distanceKm} km` : ''}</div>
                )}
              </div>
              <div className="flex gap-2">
                {!p.isAvailable && (
                  <button onClick={()=>accept(p._id)} className="px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Accept
                  </button>
                )}
                <button onClick={()=>reject(p._id)} className="px-3 py-1.5 border rounded text-red-700 hover:bg-red-50 inline-flex items-center gap-2">
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
