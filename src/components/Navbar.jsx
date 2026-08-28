import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/destinations', label: 'Destinations' },
  { to: '/food', label: 'Food' },
  { to: '/hotels', label: 'Hotels' },
  { to: '/shopping', label: 'Shopping' },
  { to: '/transport', label: 'Transport' },
  { to: '/groups', label: 'Groups' },
];

function navLinkClass({ isActive }) {
  return [
    'px-3 py-2 rounded-full text-sm font-medium transition-colors',
    isActive
      ? 'bg-teal-600 text-base'
      : 'text-teal-600 hover:bg-sage-300',
  ].join(' ');
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 bg-base/95 backdrop-blur border-b border-sage-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <Logo />
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/preferences"
                className="px-3 py-2 rounded-full text-sm font-medium text-teal-600 hover:bg-sage-300 transition-colors"
              >
                {user?.name?.split(' ')[0] || 'Preferences'}
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-gold-500 text-teal-700 hover:bg-gold-600 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-3 py-2 rounded-full text-sm font-medium text-teal-600 hover:bg-sage-300 transition-colors"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 rounded-full text-sm font-semibold bg-gold-500 text-teal-700 hover:bg-gold-600 transition-colors"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-teal-600"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-sage-300 bg-base px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <div className="h-px bg-sage-300 my-2" />
          {isAuthenticated ? (
            <>
              <NavLink to="/preferences" className={navLinkClass} onClick={() => setOpen(false)}>
                Preferences
              </NavLink>
              <button
                onClick={handleLogout}
                className="mt-1 px-4 py-2 rounded-full text-sm font-semibold bg-gold-500 text-teal-700 text-left"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="mt-1 px-4 py-2 rounded-full text-sm font-semibold bg-gold-500 text-teal-700"
                onClick={() => setOpen(false)}
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
