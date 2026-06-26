export interface ProjectAsset {
  url: string
  alt?: string
  publicId?: string
  type: 'image' | 'pdf'
  name?: string
}

export interface ProjectAssets {
  images: ProjectAsset[]
  documents: ProjectAsset[]
}

export interface Profile {
  name: string
  title: string
  intro: string
  aboutParagraphs: string[]
  deliverables: string[]
  email: string
  phone: string
  github: string
  location: string
  photoUrl: string
  resumeUrl: string
  yearsExperience: string
}

export interface Project {
  id?: string
  title: string
  subtitle?: string
  description: string
  features: string[]
  technologies: string[]
  liveUrl?: string
  liveLabel?: string
  /** @deprecated use assets.images */
  images?: { url: string; alt: string }[]
  /** Cloudinary assets organized per project: portfolio/projects/{projectId}/ */
  assets?: ProjectAssets
  image?: string
  category?: string
  goplayTab?: string
  featured: boolean
  isGoplayGroup?: boolean
  galleryType?: string
  order: number
}

export interface SkillGroup {
  id?: string
  title: string
  skills: string[]
  order: number
}

export interface Experience {
  id?: string
  title: string
  company: string
  period: string
  location: string
  isCurrent: boolean
  achievements: string[]
  order: number
}

export interface Service {
  id?: string
  icon: string
  title: string
  description: string
  order: number
}

export interface Stat {
  id?: string
  icon: string
  number: string
  label: string
  description: string
  order: number
}

export interface Inquiry {
  id?: string
  name: string
  email: string
  projectType: string
  budgetRange: string
  projectDetails: string
  status: string
  createdAt?: { seconds: number }
}

export interface BlogPost {
  id?: string
  title: string
  excerpt: string
  imageUrl?: string
  url?: string
  createdAt?: { seconds: number }
}
