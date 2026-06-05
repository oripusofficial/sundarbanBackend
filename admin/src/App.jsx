import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AuthProvider from './context/AuthProvider'
import DashboardPage from './pages/DashboardPage'
import DocsPage from './pages/DocsPage'
import GalleryPage from './pages/GalleryPage'
import LoginPage from './pages/LoginPage'
import PackagesPage from './pages/PackagesPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<LoginPage />} path="/login" />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />} path="/">
              <Route index element={<DashboardPage />} />
              <Route element={<GalleryPage />} path="gallery" />
              <Route element={<PackagesPage />} path="packages" />
              <Route element={<DocsPage />} path="docs" />
              <Route element={<Navigate replace to="/" />} path="*" />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
