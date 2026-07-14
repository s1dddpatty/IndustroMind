"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "../features/auth/types";
import { isAuthenticated, clearSession } from "../lib/auth/session";
import { handleLogout } from "../lib/auth/utils";
import { authService } from "../features/auth/services/authService";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const validatedUser = await authService.validateSession();
          if (mounted && validatedUser) {
            setUser(validatedUser);
            setIsLoggedIn(true);
          }
        }

      } catch (error) {
        clearSession();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    checkAuth();
    return () => { mounted = false; };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    authService.logout();
    handleLogout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
