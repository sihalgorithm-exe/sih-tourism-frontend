import React from 'react';

export default function FormField({ label, error, ...inputProps }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-teal-700">{label}</span>
      <input
        {...inputProps}
        className={`mt-1.5 w-full px-3.5 py-2.5 rounded-lg border bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors ${
          error ? 'border-clay-400' : 'border-sage-500'
        }`}
      />
      {error && <span className="mt-1 block text-xs text-clay-600">{error}</span>}
    </label>
  );
}
