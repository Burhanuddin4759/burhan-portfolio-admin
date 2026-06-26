import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiSave } from 'react-icons/fi'
import { getExperience, createItem, updateItem, deleteItem } from '../../services/firestoreService'
import { COLLECTIONS } from '../../constants/collections'
import type { Experience } from '../../models/types'
import '../components/AdminForms.css'

export default function ExperiencePage() {
  const [items, setItems] = useState<(Experience & { id: string })[]>([])
  const [editing, setEditing] = useState<(Experience & { id?: string }) | null>(null)
  const [achInput, setAchInput] = useState('')

  const load = () => getExperience().then(setItems)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    if (editing.id) await updateItem(COLLECTIONS.EXPERIENCE, editing.id, editing)
    else await createItem(COLLECTIONS.EXPERIENCE, editing)
    setEditing(null)
    load()
  }

  if (editing) {
    return (
      <div>
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
                <button className="admin-btn admin-btn--danger" onClick={() => setEditing({ ...editing, achievements: editing.achievements.filter((_, j) => j !== i) })}>×</button>
              </div>
            ))}
          </div>
          <label><input type="checkbox" checked={editing.isCurrent} onChange={(e) => setEditing({ ...editing, isCurrent: e.target.checked })} /> Current Position</label>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="admin-btn admin-btn--primary" onClick={save}><FiSave /> Save</button>
          <button className="admin-btn admin-btn--ghost" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 className="admin-page-title">Experience</h1><p className="admin-page-subtitle" style={{ marginBottom: 0 }}>Work history</p></div>
        <button className="admin-btn admin-btn--primary" onClick={() => setEditing({ title: '', company: '', period: '', location: '', isCurrent: false, achievements: [], order: items.length })}><FiPlus /> Add</button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="admin-list-item">
          <div><h4>{item.title} — {item.company}</h4><p>{item.period}</p></div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn--ghost" onClick={() => setEditing(item)}><FiEdit2 /></button>
            <button className="admin-btn admin-btn--danger" onClick={() => deleteItem(COLLECTIONS.EXPERIENCE, item.id).then(load)}><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  )
}
