import { Link } from 'react-router-dom';

const navLinks = [
  ['/resources',  'Resources'],
  ['/mood',       'Mood Tracker'],
  ['/assessment', 'Self-Assessment'],
  ['/helplines',  'Helplines'],
  ['/community',  'Community'],
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-mint-400 to-teal-500 flex items-center justify-center">
                <span className="text-base">🌿</span>
              </div>
              <span className="font-bold text-lg text-white">MindSpace</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A calm, supportive space for mental health awareness, self-reflection, and community connection.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {navLinks.map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-400 hover:text-mint-400 transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Important</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              MindSpace is for informational purposes only and is not a substitute for professional
              medical advice, diagnosis, or treatment.
            </p>
            <p className="text-sm text-red-400 font-medium">
              In crisis? Call your local emergency services — 100, 911, 999, or 112.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} MindSpace — Built with care for mental wellness.
        </div>
      </div>
    </footer>
  );
}
