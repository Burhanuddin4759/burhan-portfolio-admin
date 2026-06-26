import { NavLink, Outlet } from 'react-router-dom'
import {
  FiHome, FiUser, FiFolder, FiAward, FiBriefcase,
  FiGrid, FiBarChart2, FiMail, FiBookOpen, FiLogOut,
} from 'react-icons/fi'
import { useAuth } from '../../viewmodels/useAuth'
import './AdminLayout.css'

const NAV = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/profile', icon: FiUser, label: 'Profile' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
  { to: '/skills', icon: FiAward, label: 'Skills' },
  { to: '/experience', icon: FiBriefcase, label: 'Experience' },
  { to: '/services', icon: FiGrid, label: 'Services' },
  { to: '/stats', icon: FiBarChart2, label: 'Stats' },
  { to: '/inquiries', icon: FiMail, label: 'Inquiries' },
  { to: '/blog', icon: FiBookOpen, label: 'Blog' },
]

export default function AdminLayout() {
  const { logout } = useAuth()

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h1>Portfolio Admin</h1>
          <p>Content Management</p>
        </div>
        <nav className="admin-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={logout}>
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
