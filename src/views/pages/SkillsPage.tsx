import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiSave } from 'react-icons/fi'
import { getSkills, createItem, updateItem, deleteItem } from '../../services/firestoreService'
import { COLLECTIONS } from '../../constants/collections'
import type { SkillGroup } from '../../models/types'
import '../components/AdminForms.css'

export default function SkillsPage() {
  const [items, setItems] = useState<(SkillGroup & { id: string })[]>([])
  const [editing, setEditing] = useState<(SkillGroup & { id?: string }) | null>(null)
  const [skillInput, setSkillInput] = useState('')

  const load = () => getSkills().then(setItems)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    if (editing.id) await updateItem(COLLECTIONS.SKILLS, editing.id, editing)
    else await createItem(COLLECTIONS.SKILLS, editing)
    setEditing(null)
    load()
  }

  if (editing) {
    return (
      <div>
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
                <span key={i} className="admin-tag">{s}<button onClick={() => setEditing({ ...editing, skills: editing.skills.filter((_, j) => j !== i) })}>×</button></span>
              ))}
            </div>
          </div>
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
            <button className="admin-btn admin-btn--danger" onClick={() => deleteItem(COLLECTIONS.SKILLS, item.id).then(load)}><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  )
}
