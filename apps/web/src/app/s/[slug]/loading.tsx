export default function StoryLoading() {
  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      {/* Hero skeleton */}
      <div
        className="flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center"
        style={{ background: 'linear-gradient(158deg, #FF4D6D 0%, #E8003E 48%, #C9184A 100%)', minHeight: 280 }}
      >
        <div className="h-8 w-8 animate-pulse rounded-full bg-white/30 mb-4" />
        <div className="h-7 w-48 animate-pulse rounded-full bg-white/30 mb-2" />
        <div className="h-4 w-36 animate-pulse rounded-full bg-white/20 mb-4" />
        <div className="h-7 w-32 animate-pulse rounded-full bg-white/20" />
      </div>

      {/* Timeline skeleton */}
      <div className="mx-auto max-w-lg px-4 py-8 space-y-4">
        <div className="h-4 w-32 animate-pulse rounded-full bg-neutral-200 mb-6" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="mt-1 h-10 w-10 shrink-0 animate-pulse rounded-full bg-neutral-200" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
