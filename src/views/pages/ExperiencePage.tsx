import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi'
import { getExperience, createItem, updateItem, deleteItem } from '../../services/firestoreService'
import { COLLECTIONS } from '../../constants/collections'
import { useAdminAction } from '../../hooks/useAdminAction'
import AdminFeedback from '../components/AdminFeedback'
import AdminFormActions from '../components/AdminFormActions'
import type { Experience } from '../../models/types'
import '../components/AdminForms.css'

export default function ExperiencePage() {
  const [items, setItems] = useState<(Experience & { id: string })[]>([])
  const [editing, setEditing] = useState<(Experience & { id?: string }) | null>(null)
  const [achInput, setAchInput] = useState('')
  const { saving, feedback, run, clearFeedback } = useAdminAction()

  const load = () => getExperience().then(setItems)
  useEffect(() => { load() }, [])

  const handleSave = () => {
    if (!editing) return
    run(async () => {
      if (editing.id) await updateItem(COLLECTIONS.EXPERIENCE, editing.id, editing)
      else await createItem(COLLECTIONS.EXPERIENCE, editing)
      setEditing(null)
      setAchInput('')
      await load()
    }, editing.id ? 'Experience updated successfully!' : 'Experience added successfully!')
  }

  const handleDelete = (id: string) => {
    run(async () => {
      await deleteItem(COLLECTIONS.EXPERIENCE, id)
      await load()
    }, 'Experience deleted.')
  }

  if (editing) {
    return (
      <div className={saving ? 'admin-panel--busy' : ''}>
        <AdminFeedback feedback={feedback} onDismiss={clearFeedback} />
        {saving && (
          <div className="admin-saving-bar">
            <span className="admin-btn-spinner" />
            Saving experience…
          </div>
        )}
        <h1 className="admin-page-title">{editing.id ? 'Edit' : 'New'} Experience</h1>
        <div className="admin-card">
          <div className="admin-form-row">
            <div className="admin-form-group"><label>Title</label><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div className="admin-form-group"><label>Company</label><input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} /></div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group"><label>Period</label><input value={editing.period} onChange={(e) => setEditing({ ...editing, period: e.target.value })} /></div>
            <div className="admin-form-group"><label>Location</label><input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></div>
          </div>
          <div className="admin-form-group">
            <label>Achievements</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={achInput} onChange={(e) => setAchInput(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Enter' && achInput.trim()) {
                  e.preventDefault()
                  setEditing({ ...editing, achievements: [...editing.achievements, achInput.trim()] })
                  setAchInput('')
                }
              }} placeholder="Add achievement and press Enter" />
            </div>
            {editing.achievements.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input value={a} onChange={(e) => { const list = [...editing.achievements]; list[i] = e.target.value; setEditing({ ...editing, achievements: list }) }} />
                <button type="button" className="admin-btn admin-btn--danger" onClick={() => setEditing({ ...editing, achievements: editing.achievements.filter((_, j) => j !== i) })}>×</button>
              </div>
            ))}
          </div>
          <label><input type="checkbox" checked={editing.isCurrent} onChange={(e) => setEditing({ ...editing, isCurrent: e.target.checked })} /> Current Position</label>
        </div>
        <AdminFormActions saving={saving} onSave={handleSave} onCancel={() => setEditing(null)} savingLabel="Saving..." />
      </div>
    )
  }

  return (
    <div>
      <AdminFeedback feedback={feedback} onDismiss={clearFeedback} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 className="admin-page-title">Experience</h1><p className="admin-page-subtitle" style={{ marginBottom: 0 }}>Work history</p></div>
        <button className="admin-btn admin-btn--primary" onClick={() => setEditing({ title: '', company: '', period: '', location: '', isCurrent: false, achievements: [], order: items.length })}><FiPlus /> Add</button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="admin-list-item">
          <div><h4>{item.title} — {item.company}</h4><p>{item.period}</p></div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn--ghost" onClick={() => setEditing(item)}><FiEdit2 /></button>
            <button className="admin-btn admin-btn--danger" disabled={saving} onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  )
}
