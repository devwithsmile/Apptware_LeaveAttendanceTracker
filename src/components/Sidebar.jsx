import { Link } from 'react-router-dom'
import { FiHome, FiClipboard } from 'react-icons/fi'

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/mark-attendance', icon: FiClipboard, label: 'Mark Attendance' },
  ]

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white/70 backdrop-blur-sm border-r border-gray-100/50">
      <nav className="sticky top-0 pt-8">
        <ul className="space-y-1 px-3">
          {menuItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <Link
                to={path}
                className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg group transition-colors duration-200"
              >
                <div className="p-1 rounded-md bg-white shadow-sm border border-gray-100 group-hover:border-gray-200 transition-colors duration-200">
                  <Icon size={18} />
                </div>
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar