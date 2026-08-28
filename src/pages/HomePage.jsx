import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';

const categories = [
  { to: '/destinations', label: 'Destinations', type: 'destination', blurb: 'Places worth the trip' },
  { to: '/food', label: 'Food', type: 'food', blurb: 'Local flavors' },
  { to: '/hotels', label: 'Hotels', type: 'hotel', blurb: 'Places to stay' },
  { to: '/shopping', label: 'Shopping', type: 'shopping', blurb: 'Markets & crafts' },
  { to: '/transport', label: 'Transport', type: 'transport', blurb: 'Ways to get around' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <section className="relative overflow-hidden bg-teal-600">
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 800 400">
            <path
              d="M0 300 Q 200 200 400 280 T 800 240"
              stroke="#FAF9F6"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 340 Q 220 260 420 320 T 800 300"
              stroke="#FAF9F6"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-block text-sm font-mono text-gold-300 tracking-wide mb-4">
              PLAN · SHARE · ARRIVE TOGETHER
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-base leading-tight mb-5">
              Every good trip starts with knowing where to go.
            </h1>
            <p className="text-teal-100 text-lg mb-8 max-w-lg">
              Browse destinations, food, stays and transport in one place — and keep your
              travel group together with a live safety radius.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/destinations"
                className="px-6 py-3 rounded-full font-semibold bg-gold-500 text-teal-700 hover:bg-gold-600 transition-colors"
              >
                Explore destinations
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-full font-semibold border border-teal-100/40 text-base hover:bg-teal-700 transition-colors"
                >
                  Create an account
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/recommendations"
                  className="px-6 py-3 rounded-full font-semibold border border-teal-100/40 text-base hover:bg-teal-700 transition-colors"
                >
                  See your recommendations
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <h2 className="font-display text-2xl font-semibold text-teal-700 mb-6">Start browsing</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.to}
              to={cat.to}
              className="group flex flex-col items-center text-center gap-3 bg-white border border-sage-300 rounded-xl2 p-6 shadow-soft hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
            >
              <CategoryIcon type={cat.type} className="!w-12 !h-12 group-hover:bg-gold-500 transition-colors" />
              <div>
                <p className="font-display font-semibold text-teal-700">{cat.label}</p>
                <p className="text-xs text-teal-400 mt-0.5">{cat.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="bg-sage-100 border border-sage-300 rounded-xl2 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-gold-100 ring-pulse" />
            <span className="absolute inset-2 rounded-full border-2 border-gold-500" />
            <CategoryIcon type="destination" className="relative !w-10 !h-10" bg="bg-teal-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-semibold text-teal-700 mb-1">
              Travelling as a group?
            </h3>
            <p className="text-ink/70 mb-4">
              Set a safety radius around your group leader. If anyone wanders too far, the
              leader gets alerted right away.
            </p>
            <Link
              to="/groups"
              className="inline-block px-5 py-2.5 rounded-full font-semibold bg-teal-600 text-base hover:bg-teal-700 transition-colors"
            >
              Set up a group
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
