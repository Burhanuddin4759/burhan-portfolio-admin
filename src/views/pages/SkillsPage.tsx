import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi'
import { getSkills, createItem, updateItem, deleteItem } from '../../services/firestoreService'
import { COLLECTIONS } from '../../constants/collections'
import { useAdminAction } from '../../hooks/useAdminAction'
import AdminFeedback from '../components/AdminFeedback'
import AdminFormActions from '../components/AdminFormActions'
import type { SkillGroup } from '../../models/types'
import '../components/AdminForms.css'

export default function SkillsPage() {
  const [items, setItems] = useState<(SkillGroup & { id: string })[]>([])
  const [editing, setEditing] = useState<(SkillGroup & { id?: string }) | null>(null)
  const [skillInput, setSkillInput] = useState('')
  const { saving, feedback, run, clearFeedback } = useAdminAction()

  const load = () => getSkills().then(setItems)
  useEffect(() => { load() }, [])

  const handleSave = () => {
    if (!editing) return
    run(async () => {
      if (editing.id) await updateItem(COLLECTIONS.SKILLS, editing.id, editing)
      else await createItem(COLLECTIONS.SKILLS, editing)
      setEditing(null)
      setSkillInput('')
      await load()
    }, editing.id ? 'Skill group updated successfully!' : 'Skill group created successfully!')
  }

  const handleDelete = (id: string) => {
    run(async () => {
      await deleteItem(COLLECTIONS.SKILLS, id)
      await load()
    }, 'Skill group deleted.')
  }

  if (editing) {
    return (
      <div className={saving ? 'admin-panel--busy' : ''}>
        <AdminFeedback feedback={feedback} onDismiss={clearFeedback} />
        {saving && (
          <div className="admin-saving-bar">
            <span className="admin-btn-spinner" />
            Saving skill group…
          </div>
        )}
        <h1 className="admin-page-title">{editing.id ? 'Edit' : 'New'} Skill Group</h1>
        <div className="admin-card">
          <div className="admin-form-group">
            <label>Group Title</label>
            <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>Order</label>
            <input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: +e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>Skills</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Enter' && skillInput.trim()) {
                  e.preventDefault()
                  setEditing({ ...editing, skills: [...editing.skills, skillInput.trim()] })
                  setSkillInput('')
                }
              }} placeholder="Add skill and press Enter" />
            </div>
            <div className="admin-tag-input">
              {editing.skills.map((s, i) => (
                <span key={i} className="admin-tag">{s}<button type="button" onClick={() => setEditing({ ...editing, skills: editing.skills.filter((_, j) => j !== i) })}>×</button></span>
              ))}
            </div>
          </div>
        </div>
        <AdminFormActions saving={saving} onSave={handleSave} onCancel={() => setEditing(null)} savingLabel="Saving..." />
      </div>
    )
  }

  return (
    <div>
      <AdminFeedback feedback={feedback} onDismiss={clearFeedback} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="admin-page-title">Skills</h1>
          <p className="admin-page-subtitle" style={{ marginBottom: 0 }}>Manage skill groups</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={() => setEditing({ title: '', skills: [], order: items.length })}><FiPlus /> Add Group</button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="admin-list-item">
          <div><h4>{item.title}</h4><p>{item.skills.join(', ')}</p></div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn--ghost" onClick={() => setEditing(item)}><FiEdit2 /></button>
            <button className="admin-btn admin-btn--danger" disabled={saving} onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  )
}
