import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import type { Session } from '@supabase/supabase-js';

import './index.css';
import App from './App.tsx';
import { supabase } from './supabase';
import { AuthPage } from './Pages/AuthPage';

export function AppRouter() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Bootstraps auth state from Supabase and subscribes to session changes so
   * route guards react immediately to login/logout events.
   */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center dark:bg-main-dark bg-white">
        <p className="font-semibold dark:text-primary-text text-card-dark/70">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            session ? <Navigate to="/" replace /> : <AuthPage mode="login" />
          }
        />
        <Route
          path="/signup"
          element={
            session ? <Navigate to="/" replace /> : <AuthPage mode="signup" />
          }
        />
        <Route
          path="/"
          element={
            session ? (
              <App userId={session.user.id} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={<Navigate to={session ? '/' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<AppRouter />);
