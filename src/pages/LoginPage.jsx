import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FormField from '../components/FormField.jsx';
import { getErrorMessage } from '../utils/apiError.js';

export default function LoginPage() {
  const { login, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(form);
      clearAuthError();
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not log you in. Please check your details.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-teal-700 mb-1">Welcome back</h1>
      <p className="text-teal-400 mb-8">Log in to continue planning your trip.</p>

      {authError && (
        <p className="mb-4 text-sm text-clay-600 bg-clay-100 rounded-lg px-3 py-2">{authError}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={handleChange}
        />

        {error && (
          <p className="text-sm text-clay-600 bg-clay-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full py-2.5 rounded-full font-semibold bg-teal-600 text-base hover:bg-teal-700 disabled:opacity-60 transition-colors"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-teal-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-teal-600 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
