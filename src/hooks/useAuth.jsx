import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import config from '../utils/config.js'
const AuthContext = createContext(null)

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get('token')

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser() // Fetch user data when a token is found
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get(config.BASE_BACKEND_URL + '/api/me')
      setUser(response.data.user)
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Cookies.remove('token')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await axios.post(config.BASE_BACKEND_URL + '/login', credentials)
      
      const { email } = response.data;
      console.log("response data " ,response.headers);
      
      axios.defaults.withCredentials = true; 

      // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(email) // Now correctly setting user
      return email
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const logout = () => {
    Cookies.remove('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const register = async (userData) => {
    try {
      console.log(config.BASE_BACKEND_URL+'/register');
      
      const response = await axios.post(config.BASE_BACKEND_URL + '/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      register
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}