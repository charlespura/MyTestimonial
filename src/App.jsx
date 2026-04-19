import { useEffect, useState } from 'react'
import TestimonialForm from './features/testimonials/TestimonialForm'
import TestimonialsList from './features/testimonials/TestimonialsList'
import { getDb } from './lib/firebase'
import { createTestimonial, subscribeTestimonials } from './features/testimonials/testimonialsApi'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  useEffect(() => {
    if (firebaseError) return

    const unsubscribe = subscribeTestimonials(db, {
      limitCount: 30,
      onChange: (next) => {
        setItems(next)
        setLoading(false)
      },
      onError: (e) => {
        setError(e instanceof Error ? e.message : 'Failed to load testimonials.')
        setLoading(false)
      },
    })

    return () => unsubscribe()
  }, [db, firebaseError])

  async function handleCreate(payload) {
    if (firebaseError) throw new Error(firebaseError)
    await createTestimonial(db, payload)
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

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-2">
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
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">Latest</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Stored in Firestore collection <code className="font-mono">testimonials</code>.
              </p>
            </div>
            <div className="text-sm text-zinc-500">{items.length} total</div>
          </div>
          <TestimonialsList
            items={items}
            loading={firebaseError ? false : loading}
            error={firebaseError || error}
          />
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
