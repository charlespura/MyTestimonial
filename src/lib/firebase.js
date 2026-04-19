import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { requiredEnv } from './env'

let firebaseApp
let db

export function getFirebaseApp() {
  if (firebaseApp) return firebaseApp

  const firebaseConfig = {
    apiKey: requiredEnv('VITE_FIREBASE_API_KEY'),
    authDomain: requiredEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: requiredEnv('VITE_FIREBASE_PROJECT_ID'),
    appId: requiredEnv('VITE_FIREBASE_APP_ID'),
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  }

  firebaseApp = initializeApp(firebaseConfig)
  return firebaseApp
}

export function getDb() {
  if (db) return db
  db = getFirestore(getFirebaseApp())
  return db
}
