import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'

const COLLECTION = 'testimonials'

export function subscribeTestimonials(db, { limitCount = 30, onChange, onError }) {
  const q = query(
    collection(db, COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      onChange(items)
    },
    (error) => {
      onError?.(error)
    },
  )
}

export async function createTestimonial(db, input) {
  const normalized = {
    name: input.name?.trim() || '',
    role: input.role?.trim() || 'Student',
    rating: Number(input.rating),
    headline: input.headline?.trim() || '',
    message: input.message.trim(),
    createdAt: serverTimestamp(),
  }

  if (!normalized.name) throw new Error('Nickname is required.')
  if (!normalized.message) throw new Error('Message is required.')
  if (!Number.isInteger(normalized.rating) || normalized.rating < 1 || normalized.rating > 5) {
    throw new Error('Rating must be between 1 and 5.')
  }

  await addDoc(collection(db, COLLECTION), normalized)
}
