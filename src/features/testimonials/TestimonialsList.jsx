function formatDate(value) {
  if (!value) return ''
  const date =
    typeof value?.toDate === 'function'
      ? value.toDate()
      : value instanceof Date
        ? value
        : null
  if (!date) return ''
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).format(
    date,
  )
}

function Stars({ rating }) {
  const r = Number(rating) || 0
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${r} out of 5`}>
      {Array.from({ length: 5 }).map((_, idx) => {
        const filled = idx + 1 <= r
        return (
          <svg
            key={idx}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`h-4 w-4 ${filled ? 'text-amber-400' : 'text-zinc-200'}`}
            fill="currentColor"
          >
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        )
      })}
    </div>
  )
}

export default function TestimonialsList({ items, loading, error }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-zinc-100" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {error}
      </div>
    )
  }

  if (!items.length) {
    return <div className="text-sm text-zinc-500">No testimonials yet. Be the first.</div>
  }

  return (
    <div className="space-y-3">
      {items.map((t) => {
        const name = t.name?.trim() || 'Anonymous'
        const role = t.role?.trim() || 'Student'
        const date = formatDate(t.createdAt)
        return (
          <article key={t.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <div className="text-sm font-semibold text-zinc-900">{name}</div>
                  <div className="text-xs text-zinc-500">•</div>
                  <div className="text-xs text-zinc-600">{role}</div>
                  {date ? <div className="text-xs text-zinc-400">• {date}</div> : null}
                </div>
                {t.headline?.trim() ? (
                  <div className="mt-1 text-sm font-medium text-zinc-900">{t.headline.trim()}</div>
                ) : null}
              </div>
              <Stars rating={t.rating} />
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
              {t.message}
            </p>
          </article>
        )
      })}
    </div>
  )
}
