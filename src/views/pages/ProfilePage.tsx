import { useState, useEffect, useRef } from 'react'
import { FiUpload } from 'react-icons/fi'
import { getProfile, saveProfile } from '../../services/firestoreService'
import { uploadToCloudinary } from '../../utils/uploadImage'
import { useAdminAction } from '../../hooks/useAdminAction'
import AdminFeedback from '../components/AdminFeedback'
import AdminSaveButton from '../components/AdminSaveButton'
import type { Profile } from '../../models/types'
import '../components/AdminForms.css'

const EMPTY: Profile = {
  name: '', title: '', intro: '', aboutParagraphs: [''], deliverables: [''],
  email: '', phone: '', github: '', location: '', photoUrl: '', resumeUrl: '', yearsExperience: '',
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(EMPTY)
  const [uploading, setUploading] = useState(false)
  const { saving, feedback, run, clearFeedback, setFeedback } = useAdminAction()
  const photoRef = useRef<HTMLInputElement>(null)
  const resumeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getProfile().then((p) => { if (p) setProfile(p) })
  }, [])

  const handleSave = () => {
    run(async () => {
      await saveProfile(profile)
    }, 'Profile saved successfully!')
  }

  const handleUpload = async (file: File, field: 'photoUrl' | 'resumeUrl') => {
    setUploading(true)
    setFeedback(null)
    try {
      const folder = field === 'photoUrl' ? 'portfolio/profile/photo' : 'portfolio/profile/resume'
      const { url } = await uploadToCloudinary(file, { folder })
      setProfile((p) => ({ ...p, [field]: url }))
      setFeedback({ type: 'success', message: field === 'photoUrl' ? 'Photo uploaded!' : 'Resume uploaded!' })
    } catch {
      setFeedback({ type: 'error', message: 'Upload failed. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  const busy = saving || uploading

  const updateList = (field: 'aboutParagraphs' | 'deliverables', index: number, value: string) => {
    setProfile((p) => {
      const list = [...p[field]]
      list[index] = value
      return { ...p, [field]: list }
    })
  }

  const addListItem = (field: 'aboutParagraphs' | 'deliverables') => {
    setProfile((p) => ({ ...p, [field]: [...p[field], ''] }))
  }

  return (
    <div className={busy ? 'admin-panel--busy' : ''}>
      <h1 className="admin-page-title">Profile</h1>
      <p className="admin-page-subtitle">Manage your personal information and hero section</p>
      <AdminFeedback feedback={feedback} onDismiss={clearFeedback} />
      {busy && (
        <div className="admin-saving-bar">
          <span className="admin-btn-spinner" />
          {uploading ? 'Uploading file…' : 'Saving profile…'}
        </div>
      )}

      <div className="admin-card">
        <h3>Basic Info</h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Full Name</label>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>Title</label>
            <input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
          </div>
        </div>
        <div className="admin-form-group">
          <label>Hero Intro</label>
          <textarea value={profile.intro} onChange={(e) => setProfile({ ...profile, intro: e.target.value })} rows={3} />
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Email</label>
            <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>Phone</label>
            <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>GitHub URL</label>
            <input value={profile.github} onChange={(e) => setProfile({ ...profile, github: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>Location</label>
            <input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Photo & Resume</h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Profile Photo</label>
            {profile.photoUrl && <img src={profile.photoUrl} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }} />}
            <input ref={photoRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'photoUrl')} />
            <button type="button" className="admin-btn admin-btn--ghost" disabled={busy} onClick={() => photoRef.current?.click()}><FiUpload /> Upload Photo</button>
          </div>
          <div className="admin-form-group">
            <label>Resume (PDF)</label>
            {profile.resumeUrl && <p style={{ fontSize: '0.8rem', color: '#60a5fa', marginBottom: 8 }}>Resume uploaded</p>}
            <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'resumeUrl')} />
            <button type="button" className="admin-btn admin-btn--ghost" disabled={busy} onClick={() => resumeRef.current?.click()}><FiUpload /> Upload Resume</button>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>About Paragraphs</h3>
        {profile.aboutParagraphs.map((p, i) => (
          <div key={i} className="admin-form-group">
            <label>Paragraph {i + 1}</label>
            <textarea value={p} onChange={(e) => updateList('aboutParagraphs', i, e.target.value)} rows={3} />
          </div>
        ))}
        <button className="admin-btn admin-btn--ghost" onClick={() => addListItem('aboutParagraphs')}>+ Add Paragraph</button>
      </div>

      <div className="admin-card">
        <h3>Deliverables</h3>
        {profile.deliverables.map((d, i) => (
          <div key={i} className="admin-form-group">
            <input value={d} onChange={(e) => updateList('deliverables', i, e.target.value)} placeholder={`Deliverable ${i + 1}`} />
          </div>
        ))}
        <button className="admin-btn admin-btn--ghost" onClick={() => addListItem('deliverables')}>+ Add Deliverable</button>
      </div>

      <AdminSaveButton saving={saving} onClick={handleSave} label="Save Profile" savingLabel="Saving..." disabled={uploading} />
    </div>
  )
}
