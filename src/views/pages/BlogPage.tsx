import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiExternalLink } from 'react-icons/fi'
import { getBlogPosts, createItem, updateItem, deleteItem } from '../../services/firestoreService'
import { COLLECTIONS } from '../../constants/collections'
import { slugify } from '../../utils/slugify'
import { useAdminAction } from '../../hooks/useAdminAction'
import AdminFeedback from '../components/AdminFeedback'
import AdminFormActions from '../components/AdminFormActions'
import type { BlogPost } from '../../models/types'
import '../components/AdminForms.css'

type EditingPost = BlogPost & { id?: string; slugManuallyEdited?: boolean }

const EMPTY_POST: BlogPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  imageUrl: '',
  technologies: [],
}

export default function BlogPage() {
  const [items, setItems] = useState<(BlogPost & { id: string })[]>([])
  const [editing, setEditing] = useState<EditingPost | null>(null)
  const [techInput, setTechInput] = useState('')
  const { saving, feedback, run, clearFeedback } = useAdminAction()

  const load = () => getBlogPosts().then(setItems)
  useEffect(() => { load() }, [])

  const handleTitleChange = (title: string) => {
    if (!editing) return
    const next = { ...editing, title }
    if (!editing.id && !editing.slugManuallyEdited) {
      next.slug = slugify(title)
    }
    setEditing(next)
  }

  const handleSave = () => {
    if (!editing?.title || !editing.excerpt || !editing.content) return
    run(async () => {
      const payload = {
        ...editing,
        slug: slugify(editing.slug || editing.title),
        technologies: editing.technologies || [],
      }
      delete payload.slugManuallyEdited
      if (editing.id) await updateItem(COLLECTIONS.BLOG, editing.id, payload)
      else await createItem(COLLECTIONS.BLOG, payload)
      setEditing(null)
      setTechInput('')
      await load()
    }, editing.id ? 'Blog post updated successfully!' : 'Blog post published successfully!')
  }

  const handleDelete = (id: string) => {
    run(async () => {
      await deleteItem(COLLECTIONS.BLOG, id)
      await load()
    }, 'Blog post deleted.')
  }

  const addTech = () => {
    if (!editing || !techInput.trim()) return
    const technologies = [...(editing.technologies || []), techInput.trim()]
    setEditing({ ...editing, technologies })
    setTechInput('')
  }

  const removeTech = (index: number) => {
    if (!editing) return
    setEditing({
      ...editing,
      technologies: (editing.technologies || []).filter((_, i) => i !== index),
    })
  }

  if (editing) {
    const previewSlug = slugify(editing.slug || editing.title) || 'your-post-slug'
    return (
      <div className={saving ? 'admin-panel--busy' : ''}>
        <AdminFeedback feedback={feedback} onDismiss={clearFeedback} />
        {saving && (
          <div className="admin-saving-bar">
            <span className="admin-btn-spinner" />
            {editing.id ? 'Updating post…' : 'Publishing post…'}
          </div>
        )}
        <h1 className="admin-page-title">{editing.id ? 'Edit' : 'New'} Blog Post</h1>
        <p className="admin-page-subtitle">
          Posts publish on your portfolio at <strong>/blog/{previewSlug}</strong> — no external link needed.
        </p>

        <div className="admin-card">
          <div className="admin-form-group">
            <label>Title</label>
            <input value={editing.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Building Scalable MERN APIs" />
          </div>
          <div className="admin-form-group">
            <label>URL Slug</label>
            <input
              value={editing.slug}
              onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value), slugManuallyEdited: true })}
              placeholder="building-scalable-mern-apis"
            />
          </div>
          <div className="admin-form-group">
            <label>Excerpt</label>
            <textarea
              value={editing.excerpt}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              rows={3}
              placeholder="Short summary shown on the blog listing card"
            />
          </div>
          <div className="admin-form-group">
            <label>Cover Image URL (optional)</label>
            <input value={editing.imageUrl || ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div className="admin-form-group">
            <label>Technologies (optional)</label>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Tags shown on blog cards — e.g. React Native, MongoDB, TypeScript
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                placeholder="Add technology and press Enter"
              />
              <button type="button" className="admin-btn admin-btn--ghost" onClick={addTech}>Add</button>
            </div>
            <div className="admin-tag-input">
              {editing.technologies?.map((t, i) => (
                <span key={i} className="admin-tag">{t}<button type="button" onClick={() => removeTech(i)}>×</button></span>
              ))}
            </div>
          </div>
          <div className="admin-form-group">
            <label>Content</label>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Use ## for headings, - for bullet lists, `inline code`, and code blocks:
            </p>
            <pre style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>
{`\`\`\`javascript
const example = 'Hello World'
\`\`\``}
            </pre>
            <textarea
              value={editing.content}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              rows={16}
              placeholder="Write your article content here..."
              style={{ fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <AdminFormActions
          saving={saving}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          saveLabel="Publish"
          savingLabel="Publishing..."
          disabled={!editing.title || !editing.excerpt || !editing.content}
        />
      </div>
    )
  }

  return (
    <div>
      <AdminFeedback feedback={feedback} onDismiss={clearFeedback} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="admin-page-title">Blog</h1>
          <p className="admin-page-subtitle" style={{ marginBottom: 0 }}>
            Manage articles shown on your portfolio. Each title becomes a detail page URL.
          </p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={() => setEditing({ ...EMPTY_POST })}>
          <FiPlus /> Add Post
        </button>
      </div>

      {items.length === 0 && (
        <div className="admin-card">
          <p style={{ color: '#94a3b8' }}>No posts yet. Create your first article — it will appear at /blog on your portfolio.</p>
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} className="admin-list-item">
          <div>
            <h4>{item.title}</h4>
            <p>{item.excerpt.slice(0, 100)}{item.excerpt.length > 100 ? '…' : ''}</p>
            <p style={{ fontSize: '0.75rem', color: '#60a5fa', marginTop: '0.35rem' }}>
              /blog/{item.slug || slugify(item.title)}
            </p>
            {item.technologies?.length ? (
              <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                {item.technologies.join(' · ')}
              </p>
            ) : null}
          </div>
          <div className="admin-actions">
            <a
              href={`/blog/${item.slug || slugify(item.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn--ghost"
              title="Preview on portfolio"
            >
              <FiExternalLink />
            </a>
            <button className="admin-btn admin-btn--ghost" onClick={() => setEditing(item)}><FiEdit2 /></button>
            <button className="admin-btn admin-btn--danger" disabled={saving} onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  )
}
