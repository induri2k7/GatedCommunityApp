export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <div className="flex shrink-0 items-center text-xl font-bold text-blue-600">
              VMS Admin
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 hover:bg-blue-200">
              عربي
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
