import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/resources',  label: 'Resources' },
  { to: '/mood',       label: 'Mood Tracker' },
  { to: '/assessment', label: 'Assessment' },
  { to: '/helplines',  label: 'Helplines' },
  { to: '/community',  label: 'Community' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-mint-400 to-teal-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <span className="text-base">🌿</span>
            </div>
            <span className="font-bold text-lg text-gradient">MindSpace</span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-mint-50 text-mint-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1 animate-fade-in">
          <NavLink
            to="/"
            end
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-mint-50 text-mint-700' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            Home
          </NavLink>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-mint-50 text-mint-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
