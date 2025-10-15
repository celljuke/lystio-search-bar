export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <main className="flex w-full flex-col overflow-hidden lg:h-[calc(100vh-80px)]">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Lystio
            </h2>
            <p className="text-gray-600 mb-8">
              Find your perfect apartment with our advanced search
            </p>
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-gray-500">
                The search bar above is fully responsive and includes:
              </p>
              <ul className="text-sm text-gray-500 mt-2 space-y-1">
                <li>• Location search with map pin icon</li>
                <li>• Property type selection with home icon</li>
                <li>• Price range input with dollar sign icon</li>
                <li>• Mobile-optimized layout</li>
                <li>• Purple primary color (#A540F3)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
