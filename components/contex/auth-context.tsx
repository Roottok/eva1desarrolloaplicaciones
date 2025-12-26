import { authService } from '@/services/auth-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  isLoading: boolean;
  login: (e: string, p: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const savedEmail = await AsyncStorage.getItem('userEmail');
      
      if (token) {
        setIsAuthenticated(true);
        if (savedEmail) setUserEmail(savedEmail);
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    const success = await authService.login(email, pass);
    
    if (success) {
      setIsAuthenticated(true);
      setUserEmail(email);
      await AsyncStorage.setItem('userEmail', email);
    }
    
    setIsLoading(false);
    return success;
  };

  const logout = async () => {
    await authService.logout();
    await AsyncStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};