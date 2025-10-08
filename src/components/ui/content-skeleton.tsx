export function ContentSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      {/* Titre skeleton */}
      <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>

      {/* Paragraphes skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      <div className="space-y-3 pt-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* Cartes skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  )
}
