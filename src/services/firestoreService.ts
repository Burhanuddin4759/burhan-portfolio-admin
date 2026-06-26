import {
  doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { COLLECTIONS, PROFILE_DOC_ID } from '../constants/collections'
import type { Profile, Project, SkillGroup, Experience, Service, Stat, Inquiry, BlogPost } from '../models/types'

export async function getProfile(): Promise<Profile | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.PROFILE, PROFILE_DOC_ID))
  return snap.exists() ? snap.data() as Profile : null
}

export async function saveProfile(data: Profile) {
  await setDoc(doc(db, COLLECTIONS.PROFILE, PROFILE_DOC_ID), data, { merge: true })
}

async function getOrdered<T>(col: string): Promise<(T & { id: string })[]> {
  const q = query(collection(db, col), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T & { id: string }))
}

export const getProjects = () => getOrdered<Project>(COLLECTIONS.PROJECTS)
export const getSkills = () => getOrdered<SkillGroup>(COLLECTIONS.SKILLS)
export const getExperience = () => getOrdered<Experience>(COLLECTIONS.EXPERIENCE)
export const getServices = () => getOrdered<Service>(COLLECTIONS.SERVICES)
export const getStats = () => getOrdered<Stat>(COLLECTIONS.STATS)

export async function getInquiries(): Promise<(Inquiry & { id: string })[]> {
  const q = query(collection(db, COLLECTIONS.INQUIRIES), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Inquiry & { id: string }))
}

export async function getBlogPosts(): Promise<(BlogPost & { id: string })[]> {
  const q = query(collection(db, COLLECTIONS.BLOG), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost & { id: string }))
}

export async function createItem<T extends object>(col: string, data: T) {
  return addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() })
}

export async function updateItem<T extends object>(col: string, id: string, data: T) {
  await updateDoc(doc(db, col, id), data as Record<string, unknown>)
}

export async function deleteItem(col: string, id: string) {
  await deleteDoc(doc(db, col, id))
}

export async function updateInquiryStatus(id: string, status: string) {
  await updateDoc(doc(db, COLLECTIONS.INQUIRIES, id), { status })
}
