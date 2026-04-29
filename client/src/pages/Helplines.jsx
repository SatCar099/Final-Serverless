import { useState, useEffect } from 'react';
import api from '../api/axios.js';

export default function Helplines() {
  const [helplines, setHelplines] = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get('/api/helplines')
      .then(res => setHelplines(res.data))
      .catch(() => setHelplines([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = helplines.filter(h =>
    h.country.toLowerCase().includes(search.toLowerCase()) ||
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section animate-fade-in">
      {/* Emergency banner — top, high visibility */}
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
        <span className="text-2xl flex-shrink-0 mt-0.5">🚨</span>
        <div>
          <p className="font-semibold text-red-700 text-sm">In immediate danger?</p>
          <p className="text-red-600 text-sm mt-0.5">
            Call your local emergency services immediately — <strong>100</strong>, <strong>911</strong>, <strong>999</strong>, or <strong>112</strong>.
          </p>
        </div>
      </div>

      <div className="page-header">
        <h1 className="page-title">Crisis Helplines</h1>
        <p className="page-subtitle">If you or someone you know is struggling, please reach out. You are not alone.</p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by country or organisation…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium">No helplines found for "{search}"</p>
          <button onClick={() => setSearch('')} className="btn-secondary mt-4 text-sm">Clear search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(h => (
            <div key={h.id} className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-3">
                <span className="badge bg-lavender-100 text-lavender-700">
                  🌍 {h.country}
                </span>
                {h.available_hours && (
                  <span className="text-xs text-slate-400 mt-0.5">{h.available_hours}</span>
                )}
              </div>

              <h3 className="font-semibold text-slate-800 mb-3 leading-snug">{h.name}</h3>

              <a
                href={`tel:${h.phone}`}
                className="flex items-center gap-2 group w-fit"
              >
                <span className="w-9 h-9 rounded-xl bg-mint-100 flex items-center justify-center text-base group-hover:bg-mint-200 transition-colors flex-shrink-0">
                  📞
                </span>
                <span className="text-mint-700 font-bold text-lg group-hover:text-mint-800 transition-colors">
                  {h.phone}
                </span>
              </a>

              {h.website && (
                <a
                  href={h.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 hover:underline transition-colors"
                >
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="truncate">{h.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
