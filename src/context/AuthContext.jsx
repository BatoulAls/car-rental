
import React, { createContext, useState, useEffect, useContext } from 'react';


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
 
  const [token, setToken] = useState(() => localStorage.getItem('userToken') || null);

 
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
     
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
     
      console.error("فشل تحليل بيانات المستخدم من localStorage", e);
      return null;
    }
  });


  useEffect(() => {
    if (token) {
      localStorage.setItem('userToken', token); 
    } else {
      localStorage.removeItem('userToken'); 
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [token, user]); 


  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
  };

  
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  
  const isAuthenticated = !!token; 

  return (

    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children} 
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('يجب استخدام useAuth داخل مكون AuthProvider');
  }
  return context;
};