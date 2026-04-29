import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import api from '../api/axios.js';

const MOODS = [
  { value: 'happy',   emoji: '😊', label: 'Happy',   score: 5, color: '#4ade80', bg: 'bg-green-50',  border: 'border-green-200',  ring: 'ring-green-400'  },
  { value: 'calm',    emoji: '😌', label: 'Calm',    score: 4, color: '#38bdf8', bg: 'bg-sky-50',    border: 'border-sky-200',    ring: 'ring-sky-400'    },
  { value: 'sad',     emoji: '😢', label: 'Sad',     score: 2, color: '#818cf8', bg: 'bg-indigo-50', border: 'border-indigo-200', ring: 'ring-indigo-400' },
  { value: 'anxious', emoji: '😰', label: 'Anxious', score: 2, color: '#fbbf24', bg: 'bg-amber-50',  border: 'border-amber-200',  ring: 'ring-amber-400'  },
  { value: 'angry',   emoji: '😠', label: 'Angry',   score: 1, color: '#f87171', bg: 'bg-red-50',    border: 'border-red-200',    ring: 'ring-red-400'    },
];

const moodScore = Object.fromEntries(MOODS.map(m => [m.value, m.score]));
const moodColor = Object.fromEntries(MOODS.map(m => [m.value, m.color]));

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const mood = MOODS.find(m => m.value === d.mood);
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-md text-sm">
      <p className="font-semibold text-slate-700">{mood?.emoji} {mood?.label}</p>
      <p className="text-slate-400 text-xs mt-0.5">{formatDate(d.created_at)}</p>
    </div>
  );
};

export default function MoodTracker() {
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('mindspace_session');
    if (stored) return stored;
    const id = uuidv4();
    localStorage.setItem('mindspace_session', id);
    return id;
  });
  const [selected, setSelected]   = useState(null);
  const [note, setNote]           = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [history, setHistory]     = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = useCallback(() => {
    api.get(`/api/mood/${sessionId}`)
      .then(res => setHistory(res.data))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, [sessionId]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      await api.post('/api/mood', { sessionId, mood: selected, note: note || undefined });
      setSuccess(true);
      setSelected(null);
      setNote('');
      fetchHistory();
      setTimeout(() => setSuccess(false), 3500);
    } catch {
      /* handled silently */
    } finally {
      setSubmitting(false);
    }
  }

  const chartData = [...history].reverse().map(entry => ({
    ...entry,
    score: moodScore[entry.mood] ?? 3,
    fill:  moodColor[entry.mood] ?? '#94a3b8',
    date:  formatDate(entry.created_at),
  }));

  const selectedMood = MOODS.find(m => m.value === selected);

  return (
    <div className="section max-w-3xl animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Mood Tracker</h1>
        <p className="page-subtitle">Log your mood daily and visualise your emotional patterns over time.</p>
      </div>

      {/* Log form */}
      <div className="card mb-6 border-slate-200">
        <h2 className="font-semibold text-slate-700 text-lg mb-6">How are you feeling right now?</h2>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {MOODS.map(({ value, emoji, label, bg, border, ring }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(selected === value ? null : value)}
              className={`flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all duration-200 ${
                selected === value
                  ? `${bg} ${border} ring-2 ${ring} ring-offset-1 scale-105 shadow-md`
                  : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:scale-105 hover:shadow-sm'
              }`}
            >
              <span className="text-3xl">{emoji}</span>
              <span className="text-xs font-medium text-slate-600">{label}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="flex items-center gap-2 mb-4 px-1 animate-slide-up">
            <span className="text-base">{selectedMood?.emoji}</span>
            <span className="text-sm text-slate-600">
              Feeling <strong>{selectedMood?.label}</strong> — add a note below (optional)
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="What's on your mind? (optional)"
            rows={3}
            maxLength={1000}
            className="textarea mb-4"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!selected || submitting}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                'Log Mood'
              )}
            </button>
            {success && (
              <span className="text-sm text-mint-600 font-semibold animate-fade-in flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Mood logged!
              </span>
            )}
            {!selected && (
              <span className="text-xs text-slate-400">Select a mood to continue</span>
            )}
          </div>
        </form>
      </div>

      {/* History */}
      {loadingHistory ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : history.length === 0 ? (
        <div className="card text-center py-12 border-dashed border-slate-200">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-slate-500 font-medium">No entries yet</p>
          <p className="text-sm text-slate-400 mt-1">Log your first mood above to see your history here.</p>
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-slate-700 text-lg">Your Mood History</h2>
            <span className="text-xs text-slate-400 badge bg-slate-100">{history.length} entries</span>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 6]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 6 }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 pb-5 border-b border-slate-100">
            {MOODS.map(({ value, emoji, label, color }) => (
              <div key={value} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: color }} />
                {emoji} {label}
              </div>
            ))}
          </div>

          {/* Recent entries */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {history.slice(0, 4).map(entry => {
              const mood = MOODS.find(m => m.value === entry.mood);
              return (
                <div key={entry.id} className={`rounded-xl p-3 text-center ${mood?.bg ?? 'bg-slate-50'} border ${mood?.border ?? 'border-slate-100'}`}>
                  <div className="text-2xl mb-1">{mood?.emoji}</div>
                  <div className="text-xs font-semibold text-slate-600">{mood?.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{formatDate(entry.created_at)}</div>
                  {entry.note && (
                    <div className="text-xs text-slate-400 mt-1.5 italic line-clamp-2">"{entry.note}"</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
