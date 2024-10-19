import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  iconUrl: string;
  login: (token: string, name: string, icon: string) => void; // 3つの引数を受け取るように修正
  logout: () => void;
  updateUserName: (name: string, icon: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userName: '',
  iconUrl: '',
  login: () => {},
  logout: () => {},
  updateUserName: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [iconUrl, setIconUrl] = useState<string>('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedIconUrl = localStorage.getItem('iconUrl');
    const token = localStorage.getItem('authToken');

    if (token && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
      setIconUrl(storedIconUrl || '');
    }
  }, []);

  const login = (token: string, name: string, icon: string) => {
    console.log('ログイン時の引数:', { token, name, icon });
    setIsLoggedIn(true);
    setUserName(name);
    setIconUrl(icon);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userName', name);
    localStorage.setItem('iconUrl', icon);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setIconUrl('');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('iconUrl');
  };

  const updateUserName = (name: string, icon: string) => {
    setUserName(name);
    setIconUrl(icon);
    localStorage.setItem('userName', name);
    localStorage.setItem('iconUrl', icon);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, iconUrl, login, logout, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
};
