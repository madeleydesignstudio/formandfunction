import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Form & Function
          </Link>
          <div className="flex gap-6">
            <Link href="/uc-sections" className="hover:text-gray-600">
              UC Sections
            </Link>
            <Link href="/ub-sections" className="hover:text-gray-600">
              UB Sections
            </Link>
            <Link href="/databases" className="hover:text-gray-600">
              Databases
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
} 