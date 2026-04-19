import { useState } from 'react'
import TestimonialForm from './features/testimonials/TestimonialForm'
import { getDb } from './lib/firebase'
import { createTestimonial } from './features/testimonials/testimonialsApi'

function App() {
  const [status, setStatus] = useState({ type: 'idle', message: '' })

  let db
  let firebaseError = ''
  try {
    db = getDb()
  } catch (e) {
    firebaseError =
      e instanceof Error
        ? e.message
        : 'Missing Firebase environment variables. Check your GitHub Secrets / .env.'
  }

  async function handleCreate(payload) {
    if (firebaseError) throw new Error(firebaseError)
    await createTestimonial(db, payload)
    setStatus({ type: 'success', message: 'Posted. Thanks for your feedback.' })
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-zinc-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-balance text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Testimonials — Charles Pura
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Charles Pura can view in this site{' '}
            <a
              href="https://cpportfolio.onrender.com/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-violet-700 hover:underline"
            >
              https://cpportfolio.onrender.com/
            </a>
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            Leave your feedback — rating is 1 to 5 (5 is the highest).
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900">Post a testimonial</h2>
            <p className="mt-1 text-sm text-zinc-600">Message is required. Nickname is required.</p>
          </div>
          {firebaseError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              <div className="font-semibold">Firebase config missing</div>
              <div className="mt-1">
                Set your GitHub repository Secrets (or local `.env`) and redeploy. See `README.md`.
              </div>
            </div>
          ) : (
            <TestimonialForm onSubmit={handleCreate} />
          )}

          {status.type === 'success' ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {status.message}
            </div>
          ) : null}
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-zinc-500">
        Tip: If you will deploy on GitHub Pages, remember it cannot run PHP. Use Firebase client SDK +
        Firestore rules instead.
      </footer>
    </div>
  )
}

export default App
