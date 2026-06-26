import { useEffect, useState } from 'react'
import { getProjects, getInquiries, getBlogPosts } from '../../services/firestoreService'

export default function DashboardPage() {
  const [counts, setCounts] = useState({ projects: 0, inquiries: 0, blog: 0, newInquiries: 0 })

  useEffect(() => {
    Promise.all([getProjects(), getInquiries(), getBlogPosts()]).then(([p, i, b]) => {
      setCounts({
        projects: p.length,
        inquiries: i.length,
        blog: b.length,
        newInquiries: i.filter((inq) => inq.status === 'new').length,
      })
    })
  }, [])

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-subtitle">Overview of your portfolio content</p>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="stat-value">{counts.projects}</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-value">{counts.inquiries}</div>
          <div className="stat-label">Total Inquiries</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-value">{counts.newInquiries}</div>
          <div className="stat-label">New Inquiries</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-value">{counts.blog}</div>
          <div className="stat-label">Blog Posts</div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Quick Start</h3>
        <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.9rem' }}>
          Use the sidebar to manage your portfolio content. Start by updating your <strong style={{ color: '#60a5fa' }}>Profile</strong> with your photo and resume URL via Cloudinary uploads.
          Add or edit <strong style={{ color: '#60a5fa' }}>Projects</strong>, <strong style={{ color: '#60a5fa' }}>Skills</strong>, and other sections.
          Client inquiries from the Hire Me form appear in <strong style={{ color: '#60a5fa' }}>Inquiries</strong>.
        </p>
      </div>
    </div>
  )
}
