import { Link } from 'react-router-dom'
import { ClipboardList, Users, BusFront } from 'lucide-react'

export default function Dashboard(){
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/registrations" className="p-6 bg-white rounded shadow-sm border hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-blue-700" />
            <div>
              <div className="font-semibold">View Registrations</div>
              <div className="text-sm text-gray-600">Approve or reject applications</div>
            </div>
          </div>
        </Link>
        <Link to="/admin/drivers" className="p-6 bg-white rounded shadow-sm border hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <BusFront className="h-6 w-6 text-blue-700" />
            <div>
              <div className="font-semibold">Manage Drivers</div>
              <div className="text-sm text-gray-600">Add, edit, or remove drivers</div>
            </div>
          </div>
        </Link>
        <Link to="/" className="p-6 bg-white rounded shadow-sm border hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-700" />
            <div>
              <div className="font-semibold">Back to Site</div>
              <div className="text-sm text-gray-600">Return to public pages</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
