import React from 'react';
import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-sage-300 bg-sage-100 mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-sm text-teal-400 text-center sm:text-right">
          Plan trips, find your way, and keep your group together.
        </p>
      </div>
    </footer>
  );
}
