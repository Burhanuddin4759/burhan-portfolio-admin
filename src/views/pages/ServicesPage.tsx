import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi'
import { getServices, createItem, updateItem, deleteItem } from '../../services/firestoreService'
import { COLLECTIONS, SERVICE_ICON_OPTIONS } from '../../constants/collections'
import { useAdminAction } from '../../hooks/useAdminAction'
import AdminFeedback from '../components/AdminFeedback'
import AdminFormActions from '../components/AdminFormActions'
import type { Service } from '../../models/types'
import '../components/AdminForms.css'

export default function ServicesPage() {
  const [items, setItems] = useState<(Service & { id: string })[]>([])
  const [editing, setEditing] = useState<(Service & { id?: string }) | null>(null)
  const { saving, feedback, run, clearFeedback } = useAdminAction()

  const load = () => getServices().then(setItems)
  useEffect(() => { load() }, [])

  const handleSave = () => {
    if (!editing) return
    run(async () => {
      if (editing.id) await updateItem(COLLECTIONS.SERVICES, editing.id, editing)
      else await createItem(COLLECTIONS.SERVICES, editing)
      setEditing(null)
      await load()
    }, editing.id ? 'Service updated successfully!' : 'Service created successfully!')
  }

  const handleDelete = (id: string) => {
    run(async () => {
      await deleteItem(COLLECTIONS.SERVICES, id)
      await load()
    }, 'Service deleted.')
  }

  if (editing) {
    return (
      <div className={saving ? 'admin-panel--busy' : ''}>
        <AdminFeedback feedback={feedback} onDismiss={clearFeedback} />
        {saving && (
          <div className="admin-saving-bar">
            <span className="admin-btn-spinner" />
            Saving service…
          </div>
        )}
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
        <AdminFormActions saving={saving} onSave={handleSave} onCancel={() => setEditing(null)} savingLabel="Saving..." />
      </div>
    )
  }

  return (
    <div>
      <AdminFeedback feedback={feedback} onDismiss={clearFeedback} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 className="admin-page-title">Services</h1><p className="admin-page-subtitle" style={{ marginBottom: 0 }}>Services you offer</p></div>
        <button className="admin-btn admin-btn--primary" onClick={() => setEditing({ icon: 'FaCode', title: '', description: '', order: items.length })}><FiPlus /> Add</button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="admin-list-item">
          <div><h4>{item.title}</h4><p>{item.description.slice(0, 80)}</p></div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn--ghost" onClick={() => setEditing(item)}><FiEdit2 /></button>
            <button className="admin-btn admin-btn--danger" disabled={saving} onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  )
}
