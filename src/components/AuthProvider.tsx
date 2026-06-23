'use client';

import React, { useState, useEffect } from 'react';
import { AuthContext, UserSession } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: UserSession | null;
  ssrChecked?: boolean;
}

export function AuthProvider({ children, initialUser, ssrChecked = false }: AuthProviderProps) {
  const [user, setUser] = useState<UserSession | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(!initialUser && !ssrChecked);
  const router = useRouter();

  useEffect(() => {
    // If initialUser was not pre-fetched (or page is statically rendered/DB failed), fetch it
    if (initialUser === null && !ssrChecked) {
      const checkUserSession = async () => {
        try {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error('Failed checking user session:', err);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      checkUserSession();
    } else {
      setUser(initialUser);
      setLoading(false);
    }
  }, [initialUser, ssrChecked]);

  const login = (userData: UserSession) => {
    setUser(userData);
    router.refresh();
  };

  const signup = (userData: UserSession) => {
    setUser(userData);
    router.refresh();
  };

  const logout = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
