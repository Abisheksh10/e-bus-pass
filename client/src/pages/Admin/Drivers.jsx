import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Plus, Pencil, Trash2, RefreshCcw, Phone, MapPin } from 'lucide-react'

export default function Drivers(){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const [form, setForm] = useState({ id:'', name:'', phone:'', busno:'', route:'', photo:'' })
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)

  function set(k,v){ setForm(p=>({...p,[k]:v})) }

  async function load(){
    setErr('')
    setLoading(true)
    try {
      const { data } = await api.get('/drivers') // GET /api/drivers
      setList(data || [])
    } catch (e) {
      setErr(e?.response?.data?.message || 'Could not load drivers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  async function upsert(e){
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      if (editingId) {
        await api.put(`/drivers/${editingId}`, form) // PUT /api/drivers/:id
      } else {
        await api.post('/drivers', form) // POST /api/drivers
      }
      setForm({ id:'', name:'', phone:'', busno:'', route:'', photo:'' })
      setEditingId(null)
      await load()
    } catch (e) {
      setErr(e?.response?.data?.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  async function del(id){
    setErr('')
    try {
      await api.delete(`/drivers/${id}`) // DELETE /api/drivers/:id
      await load()
    } catch (e) {
      setErr(e?.response?.data?.message || 'Delete failed')
    }
  }

  function edit(d){
    setForm({ id:d.id || '', name:d.name || '', phone:d.phone || '', busno:d.busno || '', route:d.route || '', photo:d.photo || '' })
    setEditingId(d._id)
  }

  function cancel(){
    setForm({ id:'', name:'', phone:'', busno:'', route:'', photo:'' })
    setEditingId(null)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">{editingId ? 'Update Driver' : 'Add Driver'}</h2>
          <button onClick={load} className="inline-flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {err && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</div>}

        <form onSubmit={upsert} className="space-y-2 bg-white p-4 rounded shadow-sm border">
          <input className="w-full border p-2 rounded" placeholder="Driver ID (unique)" value={form.id} onChange={e=>set('id',e.target.value)} required />
          <input className="w-full border p-2 rounded" placeholder="Name" value={form.name} onChange={e=>set('name',e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="relative">
              <Phone className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
              <input className="w-full border p-2 rounded pl-9" placeholder="Phone" value={form.phone} onChange={e=>set('phone',e.target.value)} required />
            </div>
            <input className="w-full border p-2 rounded" placeholder="Bus Number" value={form.busno} onChange={e=>set('busno',e.target.value)} required />
          </div>
          <div className="relative">
            <MapPin className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
            <input className="w-full border p-2 rounded pl-9" placeholder="Route (text)" value={form.route} onChange={e=>set('route',e.target.value)} required />
          </div>
          <input className="w-full border p-2 rounded" placeholder="Photo URL (optional)" value={form.photo} onChange={e=>set('photo',e.target.value)} />
          <div className="flex gap-2">
            <button disabled={busy} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2">
              {editingId ? <><Pencil className="h-4 w-4" /> Update</> : <><Plus className="h-4 w-4" /> Create</>}
            </button>
            {editingId && (
              <button type="button" onClick={cancel} className="px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Driver List</h2>
        {loading ? (
          <div className="text-gray-600">Loading…</div>
        ) : (
          <div className="space-y-2">
            {list.length === 0 && <div className="text-gray-600">No drivers found.</div>}
            {list.map(d => (
              <div key={d._id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm border">
                <div className="min-w-0">
                  <div className="font-medium truncate">{d.name}</div>
                  <div className="text-sm text-gray-600 truncate">
                    Bus {d.busno} • {d.route} • {d.phone}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded hover:bg-gray-50 inline-flex items-center gap-1" onClick={()=>edit(d)}>
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  <button className="px-3 py-1 border rounded text-red-700 hover:bg-red-50 inline-flex items-center gap-1" onClick={()=>del(d._id)}>
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
