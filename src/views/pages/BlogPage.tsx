import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiSave } from 'react-icons/fi'
import { getBlogPosts, createItem, updateItem, deleteItem } from '../../services/firestoreService'
import { COLLECTIONS } from '../../constants/collections'
import type { BlogPost } from '../../models/types'
import '../components/AdminForms.css'

export default function BlogPage() {
  const [items, setItems] = useState<(BlogPost & { id: string })[]>([])
  const [editing, setEditing] = useState<(BlogPost & { id?: string }) | null>(null)

  const load = () => getBlogPosts().then(setItems)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    if (editing.id) await updateItem(COLLECTIONS.BLOG, editing.id, editing)
    else await createItem(COLLECTIONS.BLOG, editing)
    setEditing(null)
    load()
  }

  if (editing) {
    return (
      <div>
        <h1 className="admin-page-title">{editing.id ? 'Edit' : 'New'} Blog Post</h1>
        <div className="admin-card">
          <div className="admin-form-group"><label>Title</label><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
          <div className="admin-form-group"><label>Excerpt</label><textarea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></div>
          <div className="admin-form-row">
            <div className="admin-form-group"><label>Image URL</label><input value={editing.imageUrl || ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} /></div>
            <div className="admin-form-group"><label>Post URL</label><input value={editing.url || ''} onChange={(e) => setEditing({ ...editing, url: e.target.value })} /></div>
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
        <div><h1 className="admin-page-title">Blog</h1><p className="admin-page-subtitle" style={{ marginBottom: 0 }}>Blog posts (shows Coming Soon when empty)</p></div>
        <button className="admin-btn admin-btn--primary" onClick={() => setEditing({ title: '', excerpt: '' })}><FiPlus /> Add Post</button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="admin-list-item">
          <div><h4>{item.title}</h4><p>{item.excerpt.slice(0, 80)}</p></div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn--ghost" onClick={() => setEditing(item)}><FiEdit2 /></button>
            <button className="admin-btn admin-btn--danger" onClick={() => deleteItem(COLLECTIONS.BLOG, item.id).then(load)}><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  )
}
