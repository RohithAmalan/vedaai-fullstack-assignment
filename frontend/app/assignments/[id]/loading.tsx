export default function Loading() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* Sidebar skeleton */}
      <div className="w-[240px] fixed left-0 top-0 h-full bg-white border-r border-gray-200 p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gray-200" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-10 bg-gray-200 rounded-xl mb-6" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 bg-gray-100 rounded-lg mb-2" />
        ))}
      </div>

      <div className="flex-1 ml-[240px]">
        {/* TopBar skeleton */}
        <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center gap-3 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>

        <main className="p-6 animate-pulse">
          <div className="mb-5">
            <div className="h-6 bg-gray-200 rounded w-40 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-56" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 min-h-[400px]">
            <div className="flex items-center justify-center h-64">
              <div className="w-24 h-24 rounded-full bg-gray-200" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
