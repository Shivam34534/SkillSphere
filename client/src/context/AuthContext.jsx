import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from either localStorage (persistent) or sessionStorage (session-only)
  const [user, setUser] = useState(() => {
    const storedLocal = localStorage.getItem('userInfo');
    const storedSession = sessionStorage.getItem('userInfo');
    const stored = storedLocal || storedSession;
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    const storedLocal = localStorage.getItem('userInfo');
    const storedSession = sessionStorage.getItem('userInfo');
    const stored = storedLocal || storedSession;
    return stored ? JSON.parse(stored).token : null;
  });

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      setUser(data);
      setToken(data.token);
      
      // Store in appropriate storage based on rememberMe
      if (rememberMe) {
        localStorage.setItem('userInfo', JSON.stringify(data));
      } else {
        sessionStorage.setItem('userInfo', JSON.stringify(data));
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      setUser(data);
      setToken(data.token);
      
      // For registration, we can default to sessionStorage or prompt later
      sessionStorage.setItem('userInfo', JSON.stringify(data));
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
  };

  const updateUser = (newData) => {
    const fullUpdatedUser = { ...user, ...newData };
    setUser(fullUpdatedUser);
    
    // Sync with whichever storage it was using
    if (localStorage.getItem('userInfo')) {
      localStorage.setItem('userInfo', JSON.stringify(fullUpdatedUser));
    }
    if (sessionStorage.getItem('userInfo')) {
      sessionStorage.setItem('userInfo', JSON.stringify(fullUpdatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
