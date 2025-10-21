import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users - In production, this would be server-side validated
const DEMO_USERS: User[] = [
  { id: '1', username: 'consultant', password: 'demo123', role: 'Consultant', name: 'Dr. Sarah Johnson' },
  { id: '2', username: 'resident', password: 'demo123', role: 'Resident', name: 'Dr. Michael Chen' },
  { id: '3', username: 'physicist', password: 'demo123', role: 'Physicist', name: 'Dr. Emily Rodriguez' },
  { id: '4', username: 'radiographer', password: 'demo123', role: 'Radiographer', name: 'John Smith' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = DEMO_USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
