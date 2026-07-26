import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi, fetchUsersApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('taskpulse_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      if (user && user.token) {
        try {
          const res = await getMeApi();
          const updatedUser = { ...res.data, token: user.token };
          setUser(updatedUser);
          localStorage.setItem('taskpulse_user', JSON.stringify(updatedUser));
        } catch (err) {
          console.warn('Session check failed:', err);
          // Auto login as demo user if session expired so app stays active
          if (!user._id) handleDemoLogin('alex.morgan@company.com');
        }
      } else {
        // Auto-login default demo user (Alex Morgan) on first load for frictionless preview
        handleDemoLogin('alex.morgan@company.com');
      }
      setLoading(false);
    };

    initAuth();
    loadTeamUsers();
  }, []);

  const loadTeamUsers = async () => {
    try {
      if (user && user.token) {
        const res = await fetchUsersApi();
        setUsersList(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch team users:', err);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await loginApi(email, password);
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('taskpulse_user', JSON.stringify(userData));
      await loadTeamUsers();
      return userData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (name, email, password, role, department) => {
    setError(null);
    try {
      const res = await registerApi({ name, email, password, role, department });
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('taskpulse_user', JSON.stringify(userData));
      await loadTeamUsers();
      return userData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const handleDemoLogin = async (email = 'alex.morgan@company.com') => {
    try {
      const res = await loginApi(email, 'password123');
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('taskpulse_user', JSON.stringify(userData));
      await loadTeamUsers();
      return userData;
    } catch (err) {
      console.error('Demo login fallback error:', err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskpulse_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      usersList,
      login,
      register,
      logout,
      handleDemoLogin,
      refreshUsers: loadTeamUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
