function StarIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-6 w-6 ${filled ? 'text-amber-400' : 'text-zinc-300'}`}
      fill="currentColor"
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}

export default function StarRatingInput({ value, onChange, name = 'rating' }) {
  const rating = Number(value) || 0

  return (
    <div className="flex items-center gap-2">
      <input type="hidden" name={name} value={rating} />
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => {
          const star = index + 1
          const filled = star <= rating
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-label={`Rate ${star} out of 5`}
            >
              <StarIcon filled={filled} />
            </button>
          )
        })}
      </div>
      <div className="text-sm text-zinc-600">{rating}/5</div>
    </div>
  )
}

