import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './viewmodels/useAuth'
import AdminLayout from './views/components/AdminLayout'
import ProtectedRoute from './views/components/ProtectedRoute'
import LoginPage from './views/pages/LoginPage'
import DashboardPage from './views/pages/DashboardPage'
import ProfilePage from './views/pages/ProfilePage'
import ProjectsPage from './views/pages/ProjectsPage'
import SkillsPage from './views/pages/SkillsPage'
import ExperiencePage from './views/pages/ExperiencePage'
import ServicesPage from './views/pages/ServicesPage'
import StatsPage from './views/pages/StatsPage'
import InquiriesPage from './views/pages/InquiriesPage'
import BlogPage from './views/pages/BlogPage'
import './index.css'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-loading">
        Loading...
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="blog" element={<BlogPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
