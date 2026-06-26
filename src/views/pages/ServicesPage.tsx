import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiSave } from 'react-icons/fi'
import { getServices, createItem, updateItem, deleteItem } from '../../services/firestoreService'
import { COLLECTIONS, SERVICE_ICON_OPTIONS } from '../../constants/collections'
import type { Service } from '../../models/types'
import '../components/AdminForms.css'

export default function ServicesPage() {
  const [items, setItems] = useState<(Service & { id: string })[]>([])
  const [editing, setEditing] = useState<(Service & { id?: string }) | null>(null)

  const load = () => getServices().then(setItems)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    if (editing.id) await updateItem(COLLECTIONS.SERVICES, editing.id, editing)
    else await createItem(COLLECTIONS.SERVICES, editing)
    setEditing(null)
    load()
  }

  if (editing) {
    return (
      <div>
        <h1 className="admin-page-title">{editing.id ? 'Edit' : 'New'} Service</h1>
        <div className="admin-card">
          <div className="admin-form-group"><label>Title</label><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
          <div className="admin-form-group"><label>Description</label><textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Icon</label>
              <select value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })}>
                {SERVICE_ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="admin-form-group"><label>Order</label><input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: +e.target.value })} /></div>
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
        <div><h1 className="admin-page-title">Services</h1><p className="admin-page-subtitle" style={{ marginBottom: 0 }}>Services you offer</p></div>
        <button className="admin-btn admin-btn--primary" onClick={() => setEditing({ icon: 'FaCode', title: '', description: '', order: items.length })}><FiPlus /> Add</button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="admin-list-item">
          <div><h4>{item.title}</h4><p>{item.description.slice(0, 80)}</p></div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn--ghost" onClick={() => setEditing(item)}><FiEdit2 /></button>
            <button className="admin-btn admin-btn--danger" onClick={() => deleteItem(COLLECTIONS.SERVICES, item.id).then(load)}><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  )
}
