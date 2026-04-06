import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Shell from './components/layout/Shell'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'
import Validate from './pages/Validate'
import BulkUpload from './pages/BulkUpload'
import History from './pages/History'
import Analytics from './pages/Analytics'
import Integrations from './pages/Integrations'
import Settings from './pages/Settings'
import Users from './pages/Users'

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium border border-[#e3eaf7] shadow-sm' }} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/validate"     element={<Validate />} />
          <Route path="/bulk-upload"  element={<BulkUpload />} />
          <Route path="/history"      element={<History />} />
          <Route path="/analytics"    element={<Analytics />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings"     element={<Settings />} />
          <Route path="/users"        element={<Users />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}
