'use client';

import { createContext } from 'react';

export interface UserSession {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (user: UserSession) => void;
  logout: () => Promise<void>;
  signup: (user: UserSession) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
