import { useState } from 'react';
import { Link } from 'react-router';

import { supabase } from '../supabase';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === 'signup';

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Routes auth form submission to signup or login and surfaces Supabase errors
   * directly so users can act on actionable backend feedback.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password are required.');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      setIsLoading(false);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage('Account created. You can now log in.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-4 dark:bg-main-dark bg-white">
      <div className="w-full max-w-md rounded-2xl shadow-2xl dark:bg-card-dark bg-main-white p-8">
        <h1 className="text-2xl font-bold mb-2 dark:text-primary-text text-card-dark/70">
          {isSignup ? 'Create account' : 'Welcome back'}
        </h1>
        <p className="dark:text-secondary-text text-card-dark/60 mb-6">
          {isSignup
            ? 'Sign up to start using your Kanban board.'
            : 'Log in to access your Kanban board.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <label className="flex flex-col gap-y-2">
            <span className="font-semibold text-sm dark:text-primary-text text-card-dark/70">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-3 py-2 dark:text-primary-text text-card-dark/70 text-sm"
            />
          </label>

          <label className="flex flex-col gap-y-2">
            <span className="font-semibold text-sm dark:text-primary-text text-card-dark/70">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-3 py-2 dark:text-primary-text text-card-dark/70 text-sm"
            />
          </label>

          {isSignup && (
            <label className="flex flex-col gap-y-2">
              <span className="font-semibold text-sm dark:text-primary-text text-card-dark/70">
                Confirm password
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-3 py-2 dark:text-primary-text text-card-dark/70 text-sm"
              />
            </label>
          )}

          {errorMessage && (
            <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-action py-2 rounded-full cursor-pointer font-semibold hover:bg-action/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-sm dark:text-secondary-text text-card-dark/60">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <Link
            to={isSignup ? '/login' : '/signup'}
            className="text-action font-semibold hover:underline"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </Link>
        </p>
      </div>
    </main>
  );
}
