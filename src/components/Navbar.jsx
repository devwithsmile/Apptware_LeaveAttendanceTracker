import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FiLogOut } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white/70 backdrop-blur-sm border-b border-gray-100/50">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold text-gray-800 flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-200">
                A
              </div>
              <span>Attendance</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-gray-700 font-medium">{user?.name}</span>
            <button
              onClick={logout}
              className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar