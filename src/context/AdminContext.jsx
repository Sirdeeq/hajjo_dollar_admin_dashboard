import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hajjo_admin_token');
    const storedAdmin = localStorage.getItem('hajjo_admin_user');
    
    if (token && storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = res.data;
      
      localStorage.setItem('hajjo_admin_token', token);
      localStorage.setItem('hajjo_admin_user', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAdmin(user);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  const updateAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('hajjo_admin_user', JSON.stringify(adminData));
  };

  const logout = () => {
    localStorage.removeItem('hajjo_admin_token');
    localStorage.removeItem('hajjo_admin_user');
    delete axios.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, loading, updateAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
