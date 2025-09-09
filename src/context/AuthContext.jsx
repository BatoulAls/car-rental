import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthContext: Initializing...');
    const storedToken = localStorage.getItem('userToken');
    const storedUser = localStorage.getItem('user');

    console.log('🔍 AuthContext: Stored token:', !!storedToken);
    console.log('🔍 AuthContext: Stored user:', !!storedUser);

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      console.log('✅ AuthContext: User is authenticated');
    } else {
      setIsAuthenticated(false);
      console.log('❌ AuthContext: User is NOT authenticated');
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('👤 AuthContext: User role:', parsedUser?.role);
      } catch (e) {
        console.error('💥 AuthContext: Failed to parse user data', e);
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    }

    setLoading(false);
    console.log('✅ AuthContext: Initialization complete');
  }, []);

  useEffect(() => {
    console.log('🔄 AuthContext: Token changed:', !!token);
    if (token) {
      localStorage.setItem('userToken', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('userToken');
      setIsAuthenticated(false);
    }
  }, [token]);

  useEffect(() => {
    console.log('🔄 AuthContext: User changed:', user?.role);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (newToken, userData) => {
    console.log('🔑 AuthContext: Login called with role:', userData?.role);
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('🚪 AuthContext: Logout called');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue = {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    loading
  };

  console.log('📊 AuthContext: Current state:', {
    hasToken: !!token,
    hasUser: !!user,
    userRole: user?.role,
    isAuthenticated,
    loading
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};