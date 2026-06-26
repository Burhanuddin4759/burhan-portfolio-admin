import { readFileSync, existsSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const ASSETS = join(ROOT, 'burhan-portfolio/src/assets')
const ENV_PATH = join(__dirname, '../.env')

function loadEnv() {
  const env = {}
  for (const line of readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq > 0) env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return env
}

async function uploadImage(filePath, cloudName, preset) {
  const buffer = readFileSync(filePath)
  const form = new FormData()
  form.append('file', new Blob([buffer]), basename(filePath))
  form.append('upload_preset', preset)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || `Upload failed: ${basename(filePath)}`)
  return data.secure_url
}

async function uploadImages(relativePaths, cloudName, preset) {
  const urls = []
  for (const rel of relativePaths) {
    const full = join(ASSETS, rel)
    if (!existsSync(full)) { console.warn(`  ⚠ Missing: ${rel}`); continue }
    process.stdout.write(`  ↑ ${rel}...`)
    urls.push(await uploadImage(full, cloudName, preset))
    console.log(' done')
  }
  return urls
}

const PROFILE = {
  name: 'Burhan Ud Din', title: 'Full Stack MERN & React Native Engineer',
  intro: '2+ years building production apps across mobile and web. I develop end-to-end MERN solutions — React.js with Vite, MongoDB, Express — and high-performance React Native apps with real-time features.',
  aboutParagraphs: [
    "I'm a Full Stack MERN Engineer and React Native Developer with 2+ years of professional experience building production-ready applications.",
    'At ImproData, I built GoPlay — a complete sports facility management ecosystem.',
    'My expertise spans state management (Redux, React Query), real-time features (WebSockets, Firebase), API design, and performance optimization.',
  ],
  deliverables: ['Full stack MERN web apps with React.js, Vite, MongoDB & Express', 'High-performance cross-platform mobile apps with React Native', 'Admin dashboards, analytics, reports & booking management systems', 'REST APIs, real-time sockets, and third-party integrations', 'Scalable architectures, reusable components & performance optimization', 'Complete deployment — web portals, App Store & Google Play Store'],
  email: 'burhann4759@gmail.com', phone: '+92 321 1334882', github: 'https://github.com/Burhanuddin4759', location: 'Karachi, Pakistan', photoUrl: '', resumeUrl: '', yearsExperience: '2+',
}

const STATS = [
  { icon: 'FaProjectDiagram', number: '8+', label: 'Projects Completed', description: 'Mobile apps, web portals & full stack solutions', order: 0 },
  { icon: 'FaCodeBranch', number: '2+', label: 'Years Experience', description: 'MERN stack & React Native development', order: 1 },
  { icon: 'FaServer', number: '1+', label: 'Year MERN Stack', description: 'MongoDB, Express, React & Node.js', order: 2 },
  { icon: 'FaAward', number: '1', label: 'Published App', description: 'Live on Google Play Store', order: 3 },
]

const SKILLS = [
  { title: 'MERN Stack & Web', skills: ['React.js', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JavaScript', 'TypeScript'], order: 0 },
  { title: 'Mobile Development', skills: ['React Native', 'React Hooks', 'Redux', 'Zustand', 'React Query', 'MMKV', 'Reanimated'], order: 1 },
  { title: 'Backend & Real-time', skills: ['MongoDB Schemas', 'Express Middleware', 'WebSockets', 'Firebase', 'ZegoCloud', 'OneSignal'], order: 2 },
  { title: 'Tools & Practices', skills: ['Git', 'Reusable Components', 'Custom Hooks', 'API Integration', 'Performance Optimization'], order: 3 },
]

const EXPERIENCE = [
  { title: 'Full Stack MERN & React Native Engineer', company: 'ImproData', period: 'August 2024 - Present', location: 'Remote', isCurrent: true, order: 0, achievements: ['Built GoPlay end-to-end: Super Admin Panel, Business Portal, MongoDB + Express backend, and React Native User App', 'Integrated Firebase Push Notifications and published on Google Play Store'] },
  { title: 'React Native Developer', company: 'Oracions', period: 'September 2023 - August 2024', location: 'Remote', isCurrent: false, order: 1, achievements: ['Firebase, ZegoCloud, OneSignal integrations', 'Advanced Reanimated animations and Redux state management'] },
]

const SERVICES = [
  { icon: 'FaLaptopCode', title: 'Full Stack Web Development', description: 'End-to-end MERN applications with React.js, Vite, MongoDB, and Express.', order: 0 },
  { icon: 'FaMobileAlt', title: 'Mobile App Development', description: 'Cross-platform mobile applications using React Native.', order: 1 },
  { icon: 'FaDatabase', title: 'Backend & API Development', description: 'RESTful APIs, MongoDB database design, Express middleware.', order: 2 },
  { icon: 'FaChartLine', title: 'Analytics & Dashboards', description: 'Data-driven admin panels with charts and reports.', order: 3 },
  { icon: 'FaCode', title: 'API Integration', description: 'REST APIs, real-time sockets, and third-party services.', order: 4 },
  { icon: 'FaRocket', title: 'Performance Optimization', description: 'Optimizing re-renders, pagination, and caching.', order: 5 },
  { icon: 'FaCog', title: 'State Management', description: 'Redux, Zustand, Context API, and custom hooks.', order: 6 },
  { icon: 'FaPalette', title: 'UI/UX Design', description: 'Beautiful, responsive interfaces with animations.', order: 7 },
  { icon: 'FaBug', title: 'Bug Fixing & Support', description: 'Debugging, bug fixing, and ongoing support.', order: 8 },
]

async function buildProjects(cloudName, preset) {
  console.log('\n📸 Uploading GoPlay images to Cloudinary...')
  const [adminUrls, webUrls, mobileUrls] = await Promise.all([
    uploadImages(['goplayadmin/1.png','goplayadmin/2.png','goplayadmin/3.png','goplayadmin/4.png','goplayadmin/5.png','goplayadmin/6.png'], cloudName, preset),
    uploadImages(['goplayweb/1.png','goplayweb/2.png','goplayweb/3.png','goplayweb/4.png','goplayweb/5.png'], cloudName, preset),
    uploadImages(['goplaymobile/First.jpg','goplaymobile/Second.jpg','goplaymobile/Third.jpg','goplaymobile/Fourth.jpg','goplaymobile/Fifith.jpg','goplaymobile/6th.jpg'], cloudName, preset),
  ])
  const imgs = (urls, alts) => urls.map((url, i) => ({ url, alt: alts[i] || `Image ${i + 1}` }))
  return [
    { id: 'goplay-admin', title: 'GoPlay — Super Admin Panel', subtitle: 'Central Admin Dashboard', description: 'Centralized admin panel for the GoPlay sports platform.', features: ['Dashboard analytics', 'User management', 'Facility bookings', 'Banners & terms management'], technologies: ['React.js', 'Vite', 'MongoDB', 'Express', 'Vercel'], liveUrl: 'https://goplay-admin.vercel.app', liveLabel: 'View Live Admin Panel →', images: imgs(adminUrls, ['Admin Dashboard','FCM Dashboard','Facility Bookings','Facility Schedule','Banners','Terms']), category: 'goplay', goplayTab: 'admin', featured: true, isGoplayGroup: true, order: 0 },
    { id: 'goplay-web', title: 'GoPlay — Facility Management Portal', subtitle: 'Web Admin Dashboard', description: 'Sports facility management portal built with React.js and Vite.', features: ['Analytics dashboard', 'Booking reports', 'Schedule management', 'CRUD for facilities'], technologies: ['React.js', 'Vite', 'MongoDB', 'Express'], liveUrl: 'https://fmp.go-playapp.com', liveLabel: 'View Live Portal →', images: imgs(webUrls, ['Home Dashboard','Analytics','Booking Reports','Schedule','Pitch Management']), category: 'goplay', goplayTab: 'web', featured: true, isGoplayGroup: true, order: 1 },
    { id: 'goplay-mobile', title: 'GoPlay — User Mobile App', subtitle: 'React Native App', description: 'Cross-platform mobile app published on Google Play Store.', features: ['Facility booking', 'Real-time chat', 'Push notifications', 'Redux & React Query'], technologies: ['React Native', 'Redux', 'Firebase', 'WebSockets'], liveUrl: 'https://play.google.com/store/apps/details?id=com.goplay.sports', liveLabel: 'View on Google Play →', images: imgs(mobileUrls, ['Screen 1','Screen 2','Screen 3','Screen 4','Screen 5','Screen 6']), category: 'goplay', goplayTab: 'mobile', featured: true, isGoplayGroup: true, galleryType: 'portrait', order: 2 },
    { id: 'meta-ai-clone', title: 'Meta AI Clone', description: 'Meta AI clone with Redux and MMKV.', features: ['Text-to-image', 'Text-to-text', 'Typewriter effect'], image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop', technologies: ['React Native', 'Redux', 'MMKV'], featured: false, order: 3 },
    { id: 'ludo-star-clone', title: 'Ludo Star Clone', description: 'Ludo Star inspired UI with game logic.', features: ['1v1 game logic', 'Redux state', 'Custom board'], image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop', technologies: ['React Native', 'Redux'], featured: false, order: 4 },
    { id: 'reels-app', title: 'Reels App', description: 'Video streaming app with advanced controls.', features: ['Pinch-to-zoom', 'Subtitles', 'Full screen modes'], image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop', technologies: ['React Native', 'Video Player'], featured: false, order: 5 },
    { id: 'meeting-app', title: 'Meeting App', description: 'Real-time video conferencing app.', features: ['Video/audio calls', 'Screen sharing', 'In-meeting chat'], image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop', technologies: ['React Native', 'ZegoCloud'], featured: false, order: 6 },
    { id: 'digitalk', title: 'DigiTalk', description: 'Modern messaging platform.', features: ['Real-time messaging', 'Group chats', 'Push notifications'], image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=600&fit=crop', technologies: ['React Native', 'Firebase'], featured: false, order: 7 },
  ]
}

async function seedCollection(db, name, items, useId = false) {
  const batch = writeBatch(db)
  items.forEach((item, i) => {
    const id = useId && item.id ? item.id : `${name}-${i}`
    const { id: _id, ...data } = item
    batch.set(doc(db, name, id), data)
  })
  await batch.commit()
  console.log(`  ✓ ${name}: ${items.length} documents`)
}

async function main() {
  const env = loadEnv()
  if (!env.SEED_ADMIN_EMAIL || !env.SEED_ADMIN_PASSWORD) {
    console.error('\n❌ Add SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to burhan-portfolio-admin/.env\n')
    process.exit(1)
  }

  const app = initializeApp({ apiKey: env.VITE_FIREBASE_API_KEY, authDomain: env.VITE_FIREBASE_AUTH_DOMAIN, projectId: env.VITE_FIREBASE_PROJECT_ID, messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID, appId: env.VITE_FIREBASE_APP_ID })
  const auth = getAuth(app)
  const db = getFirestore(app)

  console.log('🔐 Signing in...')
  await signInWithEmailAndPassword(auth, env.SEED_ADMIN_EMAIL, env.SEED_ADMIN_PASSWORD)

  console.log('📝 Seeding Firestore...')
  await setDoc(doc(db, 'profile', 'main'), PROFILE)
  console.log('  ✓ profile/main')
  await seedCollection(db, 'stats', STATS)
  await seedCollection(db, 'skills', SKILLS)
  await seedCollection(db, 'experience', EXPERIENCE)
  await seedCollection(db, 'services', SERVICES)
  await seedCollection(db, 'projects', await buildProjects(env.VITE_CLOUDINARY_CLOUD_NAME, env.VITE_CLOUDINARY_UPLOAD_PRESET), true)
  console.log('\n✅ Seed complete!\n')
}

main().catch((err) => {
  console.error('\n❌', err.message)
  if (err.code === 'permission-denied' || err.message?.includes('permission')) {
    console.error('\n→ Publish firestore.rules first: Firebase Console → Firestore → Rules → Publish')
    console.error('  Or: firebase login && npm run deploy:rules (from workspace root)\n')
  }
  process.exit(1)
})
