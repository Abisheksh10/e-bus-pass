import { useState } from 'react'
import api from '../../services/api'
import { Search, ShieldAlert, CheckCircle2, IdCard, BusFront } from 'lucide-react'

export default function ViewPass(){
  const [rollno, setRollno] = useState('')
  const [status, setStatus] = useState('')
  const [data, setData] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit(e){
    e.preventDefault()
    setStatus('')
    setData(null)
    if (!rollno.trim()) {
      setStatus('Please enter your Roll Number.')
      return
    }
    setBusy(true)
    try {
      const { data } = await api.post('/passes/search', { rollno })
      if (data.code === 'NOT_FOUND') {
        setStatus('No application found for that Roll Number.')
      } else if (data.code === 'NOT_VERIFIED') {
        setStatus('Application found but not yet verified by admin.')
      } else if (data.code === 'OK') {
        setData(data.data)
      } else {
        setStatus('Unexpected response.')
      }
    } catch (e) {
      setStatus(e?.response?.data?.message || 'Could not find pass')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
      <h1 className="text-2xl font-semibold mb-1 flex items-center gap-2">
        <IdCard className="h-6 w-6 text-blue-700" /> View / Download Pass
      </h1>
      <p className="text-gray-600 mb-4">
        Enter your Roll Number to view your bus pass information and status.
      </p>

      <form onSubmit={submit} className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          placeholder="College Roll Number"
          value={rollno}
          onChange={e=>setRollno(e.target.value)}
        />
        <button
          disabled={busy}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2 disabled:opacity-60"
        >
          <Search className="h-4 w-4" /> View
        </button>
      </form>

      {!!status && (
        <div className="text-sm text-orange-800 bg-orange-50 border border-orange-200 rounded p-2 mb-2 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" /> {status}
        </div>
      )}

      {data && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-700" /> Bus Pass
          </h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><b>Name:</b> {data.fname} {data.lname}</div>
            <div><b>Year:</b> {data.year}</div>
            <div><b>Branch:</b> {data.branch}</div>
            <div><b>Roll No:</b> {data.rollno}</div>
            <div className="col-span-2"><b>Route:</b> {data.route}</div>
            <div><b>Valid till:</b> {data.datevalid}</div>
            <div className="flex items-center gap-2"><b>Bus:</b> <BusFront className="h-4 w-4" /> {data.busno || '—'}</div>
            
          </div>

          <div className="mt-3 flex gap-2">
              <a
  href={`${api.defaults.baseURL}/passes/${data._id}/pdf`}
  target="_blank"
  rel="noreferrer"
  className="px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-black text-sm"
>
  Download PDF
</a>

            </div>
        </div>
      )}
    </div>
  )
}
