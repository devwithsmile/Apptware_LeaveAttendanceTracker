import { Link } from 'react-router-dom'
import { FiHome, FiClipboard } from 'react-icons/fi'

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/mark-attendance', icon: FiClipboard, label: 'Mark Attendance' },
  ]

  return (
    <aside className="w-64 h-screen bg-white">
      <nav className="mt-8">
        <ul className="space-y-2">
          {menuItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <Link
                to={path}
                className="flex items-center gap-4 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar