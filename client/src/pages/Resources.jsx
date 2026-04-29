import { useState, useEffect } from 'react';
import api from '../api/axios.js';

const CATEGORIES = ['all', 'anxiety', 'depression', 'self-care', 'mindfulness', 'relationships'];

const CATEGORY_STYLES = {
  anxiety:       { badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400' },
  depression:    { badge: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-400'   },
  'self-care':   { badge: 'bg-mint-100 text-mint-700',     dot: 'bg-mint-400'   },
  mindfulness:   { badge: 'bg-lavender-100 text-lavender-700', dot: 'bg-lavender-400' },
  relationships: { badge: 'bg-pink-100 text-pink-700',     dot: 'bg-pink-400'   },
  wellness:      { badge: 'bg-sky-100 text-sky-700',       dot: 'bg-sky-400'    },
};

function CategoryBadge({ category }) {
  const styles = CATEGORY_STYLES[category] ?? { badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
  return (
    <span className={`badge ${styles.badge} capitalize`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} mr-1.5`} />
      {category}
    </span>
  );
}

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [category, setCategory]   = useState('all');
  const [selected, setSelected]   = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = category !== 'all' ? { category } : {};
    api.get('/api/resources', { params })
      .then(res => setResources(res.data))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="section animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Resources</h1>
        <p className="page-subtitle">Evidence-informed articles to support your mental wellness journey.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setSelected(null); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 capitalize ${
              category === cat
                ? 'bg-gradient-to-r from-mint-500 to-teal-500 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-mint-300 hover:text-mint-700 hover:bg-mint-50'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="spinner" />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-medium">No resources found for this category yet.</p>
        </div>
      ) : selected ? (
        <div className="max-w-2xl mx-auto animate-slide-up">
          <button
            onClick={() => setSelected(null)}
            className="btn-secondary mb-6 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to resources
          </button>
          <div className="card">
            <CategoryBadge category={selected.category} />
            <h2 className="text-2xl font-bold text-slate-800 mt-4 mb-4 leading-snug">{selected.title}</h2>
            {selected.image_url && (
              <img
                src={selected.image_url}
                alt={selected.title}
                className="w-full h-52 object-cover rounded-xl mb-6"
              />
            )}
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{selected.content}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map(r => (
            <div
              key={r.id}
              onClick={() => setSelected(r)}
              className="card card-interactive group flex flex-col"
            >
              {r.image_url && (
                <img
                  src={r.image_url}
                  alt={r.title}
                  className="w-full h-36 object-cover rounded-xl mb-4"
                />
              )}
              <CategoryBadge category={r.category} />
              <h3 className="font-semibold text-slate-800 mt-3 mb-2 leading-snug group-hover:text-mint-700 transition-colors">
                {r.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">{r.content}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-mint-600">
                Read article
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
