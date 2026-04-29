import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const CARD_STYLES = [
  'bg-mint-50   border-mint-100',
  'bg-sky-50    border-sky-100',
  'bg-lavender-50 border-lavender-100',
  'bg-pink-50   border-pink-100',
  'bg-amber-50  border-amber-100',
];

export default function CommunityWall() {
  const [posts, setPosts]         = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading]     = useState(true);
  const [nickname, setNickname]   = useState('');
  const [message, setMessage]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(false);

  const fetchPosts = useCallback((page = 1) => {
    setLoading(true);
    api.get('/api/community', { params: { page, limit: 12 } })
      .then(res => {
        setPosts(prev => page === 1 ? res.data.posts : [...prev, ...res.data.posts]);
        setPagination({ page, totalPages: res.data.pagination.totalPages });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPosts(1); }, [fetchPosts]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!nickname.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/api/community', { nickname: nickname.trim(), message: message.trim() });
      setNickname('');
      setMessage('');
      setSuccess(true);
      fetchPosts(1);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg
               || err.response?.data?.error
               || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = nickname.trim().length >= 2 && message.trim().length >= 5;

  return (
    <div className="section animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Community Wall</h1>
        <p className="page-subtitle">Share a thought, encouragement, or your story — anonymously and kindly.</p>
      </div>

      {/* Post form */}
      <div className="card border border-mint-200 mb-10 bg-gradient-to-br from-white to-mint-50/40">
        <h2 className="font-semibold text-slate-700 text-lg mb-1">Share with the community</h2>
        <p className="text-sm text-slate-400 mb-5">Your post is anonymous — only your chosen nickname is shown.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Nickname</label>
            <input
              type="text"
              placeholder="e.g. hopefulwave, quietmind…"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              maxLength={50}
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Message</label>
            <textarea
              placeholder="Write a message of support, share your experience, or just say hello…"
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={1000}
              rows={4}
              className="textarea"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${message.length > 900 ? 'text-orange-500' : 'text-slate-400'}`}>
                {message.length}/1000
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              <span className="flex-shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Posting…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Post Message
                </>
              )}
            </button>
            {success && (
              <span className="text-sm text-mint-600 font-semibold animate-fade-in flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Posted!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Posts grid */}
      {loading && posts.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="spinner" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-slate-400 card border-dashed border-slate-200">
          <div className="text-4xl mb-3">💬</div>
          <p className="font-medium">No posts yet</p>
          <p className="text-sm mt-1">Be the first to share something with the community!</p>
        </div>
      ) : (
        <>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className={`break-inside-avoid border rounded-2xl p-5 transition-shadow duration-200 hover:shadow-sm ${CARD_STYLES[i % CARD_STYLES.length]}`}
              >
                <p className="text-slate-700 text-sm leading-relaxed mb-4">"{post.message}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-mint-400 to-teal-400 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                      {post.nickname.charAt(0).toUpperCase()}
                    </span>
                    {post.nickname}
                  </span>
                  <span className="text-xs text-slate-400">{timeAgo(post.created_at)}</span>
                </div>
              </div>
            ))}
          </div>

          {pagination.page < pagination.totalPages && (
            <div className="text-center mt-10">
              <button
                onClick={() => fetchPosts(pagination.page + 1)}
                disabled={loading}
                className="btn-secondary"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                    Loading…
                  </>
                ) : (
                  'Load More Posts'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
