import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/shared/auth/auth-context'
import { ProgressSidebar } from '@/features/progress/components/progress-sidebar'
import { Button } from '@/shared/components/ui/button'

const NAV_ITEMS = [
  { to: '/playground', label: 'Playground' },
  { to: '/learn/query', label: 'Query を学ぶ' },
  { to: '/learn/mutation', label: 'Mutation を学ぶ' },
  { to: '/learn/subscription', label: 'Subscription を学ぶ' },
] as const

export function Layout({ children }: { children: ReactNode }) {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">GraphQL 学習</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-200">
          <ProgressSidebar />
          <Button variant="ghost" size="sm" onClick={logout} className="w-full mt-3">
            ログアウト
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
