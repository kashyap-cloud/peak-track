import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { sql } from './db';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(sessionStorage.getItem('user_id'));
  const [isLoading, setIsLoading] = useState(!userId);

  useEffect(() => {
    const performHandshake = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (userId && !token) {
        setIsLoading(false);
        return;
      }

      if (!token && !userId) {
        console.error('No token found in URL and no active session');
        window.location.href = '/focus_tracker/token';
        return;
      }

      if (token) {
        try {
          const response = await axios.post('https://api.mantracare.com/user/user-info', { token });
          const newUserId = response.data.user_id?.toString();

          if (newUserId) {
            // Store in session
            sessionStorage.setItem('user_id', newUserId);
            setUserId(newUserId);

            // Sync with Neon users table (initialization upsert)
            try {
              await sql`
                INSERT INTO users (id) 
                VALUES (${newUserId}) 
                ON CONFLICT (id) DO NOTHING
              `;
            } catch (dbErr) {
              console.error('Failed to sync user to database:', dbErr);
            }

            // Clean URL
            const url = new URL(window.location.href);
            url.searchParams.delete('token');
            window.history.replaceState({}, '', url.toString());
          } else {
            throw new Error('Invalid user info response');
          }
        } catch (err) {
          console.error('Authentication handshake failed:', err);
          window.location.href = '/focus_tracker/token';
        } finally {
          setIsLoading(false);
        }
      }
    };

    performHandshake();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
        <div className="relative">
          <div className="h-24 w-24 rounded-3xl bg-primary/10 animate-pulse flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <p className="text-sm font-bold text-foreground tracking-widest uppercase opacity-70 animate-pulse">
              Preparing...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ userId, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
