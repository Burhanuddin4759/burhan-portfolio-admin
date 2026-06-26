import { useEffect, useState, useRef } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiSave } from 'react-icons/fi'
import { getProjects, createItem, updateItem, deleteItem } from '../../services/firestoreService'
import { uploadProjectAsset } from '../../utils/uploadImage'
import { COLLECTIONS } from '../../constants/collections'
import type { Project } from '../../models/types'
import '../components/AdminForms.css'

const EMPTY: Project = {
  title: '', description: '', features: [], technologies: [],
  featured: false, order: 0, assets: { images: [], documents: [] },
}

function projectFolderId(editing: Project & { id?: string }) {
  return editing.id || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'draft'
}

export default function ProjectsPage() {
  const [items, setItems] = useState<(Project & { id: string })[]>([])
  const [editing, setEditing] = useState<(Project & { id?: string }) | null>(null)
  const [techInput, setTechInput] = useState('')
  const [featureInput, setFeatureInput] = useState('')
  const imgRef = useRef<HTMLInputElement>(null)
  const pdfRef = useRef<HTMLInputElement>(null)

  const load = () => getProjects().then(setItems)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    const data = { ...editing, features: editing.features || [], technologies: editing.technologies || [] }
    if (editing.id) {
      await updateItem(COLLECTIONS.PROJECTS, editing.id, data)
    } else {
      await createItem(COLLECTIONS.PROJECTS, data)
    }
    setEditing(null)
    load()
  }

  const addTag = (field: 'technologies' | 'features', value: string, setter: (v: string) => void) => {
    if (!value.trim() || !editing) return
    setEditing({ ...editing, [field]: [...(editing[field] || []), value.trim()] })
    setter('')
  }

  const removeTag = (field: 'technologies' | 'features', index: number) => {
    if (!editing) return
    const list = [...(editing[field] || [])]
    list.splice(index, 1)
    setEditing({ ...editing, [field]: list })
  }

  const handleImageUpload = async (file: File) => {
    if (!editing) return
    const folderId = projectFolderId(editing)
    const { url, publicId } = await uploadProjectAsset(file, folderId, 'images')
    const assets = editing.assets || { images: [], documents: [] }
    const newAsset = { url, publicId, alt: editing.title, type: 'image' as const }
    setEditing({
      ...editing,
      assets: { ...assets, images: [...assets.images, newAsset] },
      images: [...(editing.images || []), { url, alt: editing.title }],
    })
  }

  const handlePdfUpload = async (file: File) => {
    if (!editing) return
    const folderId = projectFolderId(editing)
    const { url, publicId } = await uploadProjectAsset(file, folderId, 'documents')
    const assets = editing.assets || { images: [], documents: [] }
    const newDoc = { url, publicId, name: file.name, type: 'pdf' as const }
    setEditing({
      ...editing,
      assets: { ...assets, documents: [...assets.documents, newDoc] },
    })
  }

  if (editing) {
    return (
      <div>
        <h1 className="admin-page-title">{editing.id ? 'Edit' : 'New'} Project</h1>
        <div className="admin-card">
          <div className="admin-form-group">
            <label>Title</label>
            <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Subtitle</label>
              <input value={editing.subtitle || ''} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label>Order</label>
              <input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: +e.target.value })} />
            </div>
          </div>
          <div className="admin-form-group">
            <label>Description</label>
            <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Live URL</label>
              <input value={editing.liveUrl || ''} onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label>GoPlay Tab (admin/web/mobile)</label>
              <input value={editing.goplayTab || ''} onChange={(e) => setEditing({ ...editing, goplayTab: e.target.value })} />
            </div>
          </div>
          <div className="admin-form-group">
            <label>Technologies</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('technologies', techInput, setTechInput))} placeholder="Add tech and press Enter" />
              <button className="admin-btn admin-btn--ghost" onClick={() => addTag('technologies', techInput, setTechInput)}>Add</button>
            </div>
            <div className="admin-tag-input">
              {editing.technologies?.map((t, i) => (
                <span key={i} className="admin-tag">{t}<button onClick={() => removeTag('technologies', i)}>×</button></span>
              ))}
            </div>
          </div>
          <div className="admin-form-group">
            <label>Features</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('features', featureInput, setFeatureInput))} placeholder="Add feature and press Enter" />
              <button className="admin-btn admin-btn--ghost" onClick={() => addTag('features', featureInput, setFeatureInput)}>Add</button>
            </div>
            <div className="admin-tag-input">
              {editing.features?.map((f, i) => (
                <span key={i} className="admin-tag">{f}<button onClick={() => removeTag('features', i)}>×</button></span>
              ))}
            </div>
          </div>
          <div className="admin-form-group">
            <label>Images (Cloudinary: portfolio/projects/{'{projectId}'}/images)</label>
            <input ref={imgRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => imgRef.current?.click()}>Upload Image</button>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {(editing.assets?.images || editing.images)?.map((img, i) => (
                <img key={i} src={img.url} alt={img.alt} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }} />
              ))}
            </div>
          </div>
          <div className="admin-form-group">
            <label>PDF Documents (portfolio/projects/{'{projectId}'}/documents)</label>
            <input ref={pdfRef} type="file" accept=".pdf" hidden onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])} />
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => pdfRef.current?.click()}>Upload PDF</button>
            <ul style={{ marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              {editing.assets?.documents?.map((doc, i) => (
                <li key={i}><a href={doc.url} target="_blank" rel="noreferrer">{doc.name || `Document ${i + 1}`}</a></li>
              ))}
            </ul>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <label><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured</label>
            <label><input type="checkbox" checked={editing.isGoplayGroup} onChange={(e) => setEditing({ ...editing, isGoplayGroup: e.target.checked })} /> GoPlay Group</label>
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
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-subtitle" style={{ marginBottom: 0 }}>Manage portfolio projects</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={() => setEditing({ ...EMPTY, order: items.length })}><FiPlus /> Add Project</button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="admin-list-item">
          <div>
            <h4>{item.title}</h4>
            <p>{item.subtitle || item.description?.slice(0, 80)}</p>
          </div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn--ghost" onClick={() => setEditing(item)}><FiEdit2 /></button>
            <button className="admin-btn admin-btn--danger" onClick={() => { deleteItem(COLLECTIONS.PROJECTS, item.id).then(load) }}><FiTrash2 /></button>
          </div>
        </div>
      ))}
      {items.length === 0 && <p style={{ color: '#64748b' }}>No projects in Firebase yet. Portfolio shows fallback data until you add projects here.</p>}
    </div>
  )
}
