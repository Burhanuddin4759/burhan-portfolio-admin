import { useState, useEffect, useRef } from 'react'
import { FiSave, FiUpload } from 'react-icons/fi'
import { getProfile, saveProfile } from '../../services/firestoreService'
import { uploadToCloudinary } from '../../utils/uploadImage'
import type { Profile } from '../../models/types'
import '../components/AdminForms.css'

const EMPTY: Profile = {
  name: '', title: '', intro: '', aboutParagraphs: [''], deliverables: [''],
  email: '', phone: '', github: '', location: '', photoUrl: '', resumeUrl: '', yearsExperience: '',
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const photoRef = useRef<HTMLInputElement>(null)
  const resumeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getProfile().then((p) => { if (p) setProfile(p) })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    try {
      await saveProfile(profile)
      setMsg('Profile saved successfully!')
    } catch {
      setMsg('Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (file: File, field: 'photoUrl' | 'resumeUrl') => {
    try {
      const folder = field === 'photoUrl' ? 'portfolio/profile/photo' : 'portfolio/profile/resume'
      const { url } = await uploadToCloudinary(file, { folder })
      setProfile((p) => ({ ...p, [field]: url }))
    } catch {
      setMsg('Upload failed.')
    }
  }

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
    <div>
      <h1 className="admin-page-title">Profile</h1>
      <p className="admin-page-subtitle">Manage your personal information and hero section</p>
      {msg && <div className={`admin-alert ${msg.includes('success') ? 'admin-alert--success' : 'admin-alert--error'}`}>{msg}</div>}

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
            <button className="admin-btn admin-btn--ghost" onClick={() => photoRef.current?.click()}><FiUpload /> Upload Photo</button>
          </div>
          <div className="admin-form-group">
            <label>Resume (PDF)</label>
            {profile.resumeUrl && <p style={{ fontSize: '0.8rem', color: '#60a5fa', marginBottom: 8 }}>Resume uploaded</p>}
            <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'resumeUrl')} />
            <button className="admin-btn admin-btn--ghost" onClick={() => resumeRef.current?.click()}><FiUpload /> Upload Resume</button>
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

      <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
        <FiSave /> {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  )
}
