import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Team from './pages/Team'
import Signup from './pages/Auth/Signup'
import Login from './pages/Auth/Login'
import AdminLogin from './pages/Auth/AdminLogin'
import RegisterPass from './pages/Student/RegisterPass'
import RenewPass from './pages/Student/RenewPass'
import ViewPass from './pages/Student/ViewPass'
import Checkout from './pages/Payment/Checkout'
import PaymentSuccess from './pages/Payment/Success'
import Dashboard from './pages/Admin/Dashboard'
import ViewRegistrations from './pages/Admin/ViewRegistrations'
import Drivers from './pages/Admin/Drivers'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

export default function App(){
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/team" element={<Team />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Student */}
            <Route path="/busregister" element={
              <ProtectedRoute>
                <RegisterPass />
              </ProtectedRoute>
            } />
            <Route path="/renewal" element={<RenewPass />} />
            <Route path="/pass" element={<ViewPass />} />

            {/* Payment */}
            <Route path="/payment/checkout" element={<Checkout />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />

            {/* Admin */}
            <Route path="/admin" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } />
            <Route path="/admin/registrations" element={
              <AdminRoute>
                <ViewRegistrations />
              </AdminRoute>
            } />
            <Route path="/admin/drivers" element={
              <AdminRoute>
                <Drivers />
              </AdminRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
