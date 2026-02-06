import ThemeToggle from './ThemeToggle'

interface LayoutProps {
  title: string
  badge?: React.ReactNode
  onReset: () => void
  children: React.ReactNode
}

export default function Layout({ title, badge, onReset, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="navbar bg-base-100 rounded-box mb-4">
        <div className="flex-1">
          <span className="text-xl font-bold px-4">{title}</span>
          {badge}
        </div>
        <div className="flex-none gap-2">
          <ThemeToggle />
          <button className="btn btn-ghost" onClick={onReset}>
            Upload New
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}
