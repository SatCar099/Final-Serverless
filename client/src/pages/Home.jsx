import { Link } from 'react-router-dom';

const features = [
  {
    to: '/resources',
    icon: '📚',
    title: 'Resources',
    desc: 'Evidence-informed articles on anxiety, mindfulness, depression, and more.',
    gradient: 'from-mint-400 to-teal-400',
    bg: 'bg-mint-50',
    border: 'border-mint-100',
    hover: 'hover:border-mint-300',
  },
  {
    to: '/mood',
    icon: '💛',
    title: 'Mood Tracker',
    desc: 'Log how you feel each day and visualise your emotional patterns over time.',
    gradient: 'from-yellow-400 to-orange-400',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
    hover: 'hover:border-yellow-300',
  },
  {
    to: '/assessment',
    icon: '📋',
    title: 'Self-Assessment',
    desc: 'Take a PHQ-9 style quiz to better understand your current mental state.',
    gradient: 'from-lavender-400 to-sky-400',
    bg: 'bg-lavender-50',
    border: 'border-lavender-100',
    hover: 'hover:border-lavender-300',
  },
  {
    to: '/helplines',
    icon: '📞',
    title: 'Helplines',
    desc: 'Find crisis helplines and mental health support lines around the world.',
    gradient: 'from-rose-400 to-pink-400',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    hover: 'hover:border-rose-300',
  },
  {
    to: '/community',
    icon: '🤝',
    title: 'Community',
    desc: 'Share anonymously and read stories from others on their journey.',
    gradient: 'from-sky-400 to-teal-400',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    hover: 'hover:border-sky-300',
  },
];

const stats = [
  { value: '1 in 4', label: 'people experience a mental health issue in their lifetime' },
  { value: '75%', label: 'of mental health conditions begin before age 24' },
  { value: '~1M', label: 'people die by suicide each year worldwide' },
];

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-mint-50 border border-mint-200 text-mint-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse" />
            Free · Anonymous · No sign-up required
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-[1.1]">
            Your mental health<br />
            <span className="text-gradient">matters.</span>
          </h1>

          <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
            MindSpace is a calm, supportive space to explore mental health resources,
            track your mood, and connect with a community that cares.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/resources" className="btn-primary text-base px-7 py-3">
              Explore Resources
            </Link>
            <Link to="/mood" className="btn-secondary text-base px-7 py-3">
              Track My Mood
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-slate-900 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={value}>
                <div className="text-3xl font-bold text-gradient mb-1">{value}</div>
                <p className="text-sm text-slate-400 leading-relaxed max-w-[180px] mx-auto">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="section">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">What would you like to do?</h2>
          <p className="text-slate-500">Choose a section to get started — everything is private and free.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ to, icon, title, desc, gradient, bg, border, hover }) => (
            <Link
              key={to}
              to={to}
              className={`group relative ${bg} ${border} ${hover} border rounded-2xl p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                {icon}
              </div>
              <h3 className="font-semibold text-slate-800 text-base mb-1.5 group-hover:text-slate-900">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              <div className="mt-4 text-xs font-semibold text-mint-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Open <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-gradient-to-r from-mint-500 to-teal-500 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">You are not alone.</h2>
          <p className="text-mint-100 mb-8 leading-relaxed">
            Whether you're looking for information, need to check in with yourself,
            or just want to feel less alone — you're in the right place.
          </p>
          <Link to="/helplines" className="inline-flex items-center gap-2 bg-white text-mint-700 font-semibold px-6 py-3 rounded-xl shadow hover:shadow-md hover:scale-[1.02] transition-all duration-200">
            📞 Find a Helpline
          </Link>
        </div>
      </section>
    </div>
  );
}
