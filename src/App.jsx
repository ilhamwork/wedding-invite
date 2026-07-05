import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Toaster } from 'react-hot-toast'
import { AudioProvider } from './context/AudioContext'
import Home from './pages/Home'

const GuestCheckIn = lazy(() => import('./pages/GuestCheckIn'))
const AdminCheckin = lazy(() => import('./pages/AdminCheckin'))

export default function App() {
  return (
    <AudioProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guest/:id" element={<GuestCheckIn />} />
            <Route path="/admin/checkin" element={<AdminCheckin />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AudioProvider>
  )
}
