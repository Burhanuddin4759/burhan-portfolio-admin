import { useEffect, useState } from 'react'
import { getInquiries, updateInquiryStatus } from '../../services/firestoreService'
import { useAdminAction } from '../../hooks/useAdminAction'
import AdminFeedback from '../components/AdminFeedback'
import AdminSaveButton from '../components/AdminSaveButton'
import type { Inquiry } from '../../models/types'
import '../components/AdminForms.css'

export default function InquiriesPage() {
  const [items, setItems] = useState<(Inquiry & { id: string })[]>([])
  const [selected, setSelected] = useState<(Inquiry & { id: string }) | null>(null)
  const { saving, feedback, run, clearFeedback } = useAdminAction()

  const load = () => getInquiries().then(setItems)
  useEffect(() => { load() }, [])

  const markStatus = (id: string, status: string) => {
    run(async () => {
      await updateInquiryStatus(id, status)
      await load()
      if (selected?.id === id) setSelected({ ...selected, status })
    }, `Inquiry marked as ${status}.`)
  }

  return (
    <div>
      <AdminFeedback feedback={feedback} onDismiss={clearFeedback} />
      <h1 className="admin-page-title">Inquiries</h1>
      <p className="admin-page-subtitle">Client inquiries from the Hire Me form</p>

      {items.length === 0 ? (
        <p style={{ color: '#64748b' }}>No inquiries yet. They will appear here when clients submit the Hire Me form.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Project</th><th>Budget</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.projectType}</td>
                <td>{item.budgetRange}</td>
                <td><span className={`admin-badge admin-badge--${item.status}`}>{item.status}</span></td>
                <td>
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setSelected(item)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div className="admin-card" style={{ marginTop: '1.5rem' }}>
          <h3>Inquiry from {selected.name}</h3>
          <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>{selected.email}</p>
          <p><strong>Project Type:</strong> {selected.projectType}</p>
          <p><strong>Budget:</strong> {selected.budgetRange}</p>
          <p style={{ marginTop: '1rem' }}><strong>Details:</strong></p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selected.projectDetails}</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <AdminSaveButton saving={saving} onClick={() => markStatus(selected.id, 'read')} label="Mark Read" savingLabel="Updating..." />
            <button type="button" className="admin-btn admin-btn--ghost" disabled={saving} onClick={() => markStatus(selected.id, 'replied')}>Mark Replied</button>
            <button type="button" className="admin-btn admin-btn--ghost" disabled={saving} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
