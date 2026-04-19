import { useMemo, useState } from 'react'
import StarRatingInput from './StarRatingInput'

const ROLE_OPTIONS = ['Student', 'Client', 'Employee', 'Manager', 'Other']

export default function TestimonialForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [headline, setHeadline] = useState('')
  const [rating, setRating] = useState(5)
  const [role, setRole] = useState('Student')
  const [customRole, setCustomRole] = useState('')
  const [message, setMessage] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const roleValue = useMemo(() => {
    if (role === 'Other') return customRole.trim()
    return role
  }, [role, customRole])

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: 'idle', message: '' })

    const payload = {
      name,
      headline,
      rating,
      role: roleValue || 'Student',
      message,
    }

    if (!payload.name.trim()) {
      setStatus({ type: 'error', message: 'Nickname is required.' })
      return
    }
    if (!payload.message.trim()) {
      setStatus({ type: 'error', message: 'Testimonial message is required.' })
      return
    }
    if (!agreed) {
      setStatus({ type: 'error', message: 'Please confirm the agreement checkbox to continue.' })
      return
    }

    try {
      setSubmitting(true)
      await onSubmit(payload)
      setStatus({ type: 'success', message: 'Thanks! Your testimonial was posted.' })
      setHeadline('')
      setRating(5)
      setMessage('')
      setAgreed(false)
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit testimonial.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-800">
          Nickname <span className="text-rose-600">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your display name"
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-800">Rate</label>
          <div className="mt-1">
            <StarRatingInput value={rating} onChange={setRating} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">Position / Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-violet-500"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {role === 'Other' ? (
            <input
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="Type your role (e.g., Freelancer)"
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-violet-500"
            />
          ) : null}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-800">
          Title / Headline <span className="text-zinc-500">(optional)</span>
        </label>
        <input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Great System! / Highly Recommended"
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-800">
          Testimonial Message <span className="text-rose-600">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          placeholder="Write your feedback…"
          className="mt-1 w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {status.type === 'error' ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {status.message}
        </div>
      ) : null}
      {status.type === 'success' ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {status.message}
        </div>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <details className="group">
          <summary className="cursor-pointer select-none text-sm font-medium text-zinc-900">
            Privacy & Agreement
          </summary>
          <div className="mt-2 space-y-2 text-xs leading-relaxed text-zinc-600">
            <p>
              Your testimonial will be sent to and stored in Firebase Firestore (Google). Data is
              transmitted over HTTPS. Access is controlled by Firestore security rules.
            </p>
            <p>
              Do not include passwords, OTPs, bank details, or other sensitive personal information.
              This is not end-to-end encrypted content.
            </p>
          </div>
        </details>

        <label className="mt-3 flex items-start gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
            required
          />
          <span>
            By sending this testimonial, I agree that my message and nickname can be stored and
            displayed publicly.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Posting…' : 'Post Testimonial'}
      </button>

      <p className="text-xs text-zinc-500">
        Note: Firebase config values are used in the browser. Protect your database using Firestore
        security rules.
      </p>
    </form>
  )
}
