import { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import api from '../api/axios.js';

const QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or feeling like a failure',
  'Trouble concentrating on things, such as reading or watching TV',
  'Moving or speaking slowly, or being unusually fidgety or restless',
  'Thoughts that you would be better off dead, or thoughts of hurting yourself',
];

const FREQUENCY = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'Half the days' },
  { value: 3, label: 'Nearly every day' },
];

function getInterpretation(score) {
  if (score <= 4)  return { level: 'Minimal',            color: 'text-mint-600',   bg: 'bg-mint-50',     border: 'border-mint-200',    barColor: 'bg-mint-400',   desc: 'Your responses suggest minimal depressive symptoms. Keep taking care of yourself.' };
  if (score <= 9)  return { level: 'Mild',               color: 'text-sky-600',    bg: 'bg-sky-50',      border: 'border-sky-200',     barColor: 'bg-sky-400',    desc: 'Your responses suggest mild symptoms. Consider talking to someone you trust.' };
  if (score <= 14) return { level: 'Moderate',           color: 'text-yellow-600', bg: 'bg-yellow-50',   border: 'border-yellow-200',  barColor: 'bg-yellow-400', desc: 'Your responses suggest moderate symptoms. Speaking with a mental health professional is recommended.' };
  if (score <= 19) return { level: 'Moderately Severe',  color: 'text-orange-600', bg: 'bg-orange-50',   border: 'border-orange-200',  barColor: 'bg-orange-400', desc: 'Your responses suggest moderately severe symptoms. Please consider reaching out to a professional.' };
  return              { level: 'Severe',                color: 'text-red-600',    bg: 'bg-red-50',      border: 'border-red-200',     barColor: 'bg-red-500',    desc: 'Your responses suggest severe symptoms. Please reach out to a mental health professional or helpline as soon as possible.' };
}

export default function SelfAssessment() {
  const [answers, setAnswers]   = useState(Array(9).fill(null));
  const [result, setResult]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sessionId] = useState(() => localStorage.getItem('mindspace_session') || uuidv4());

  const answered  = answers.filter(a => a !== null).length;
  const allAnswered = answered === 9;
  const score     = answers.reduce((sum, a) => sum + (a ?? 0), 0);
  const progress  = Math.round((answered / 9) * 100);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!allAnswered) return;
    setSubmitting(true);
    try {
      await api.post('/api/quiz', {
        sessionId,
        score,
        answers: Object.fromEntries(answers.map((a, i) => [i, a])),
      });
    } catch { /* show result regardless */ }
    setResult(getInterpretation(score));
    setSubmitting(false);
  }

  function reset() {
    setAnswers(Array(9).fill(null));
    setResult(null);
  }

  return (
    <div className="section max-w-2xl animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Self-Assessment</h1>
        <p className="page-subtitle mb-2">
          PHQ-9 style questionnaire — over the last 2 weeks, how often have you been bothered by each of the following?
        </p>
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-block">
          ⚠️ For informational purposes only — not a medical diagnosis. Please consult a qualified professional.
        </p>
      </div>

      {result ? (
        <div className={`card border-2 ${result.border} ${result.bg} animate-slide-up`}>
          <div className="text-center mb-6">
            <p className="text-sm text-slate-500 mb-2 font-medium">Your PHQ-9 score</p>
            <div className="text-6xl font-bold text-slate-800 mb-1">{score}</div>
            <div className={`text-xl font-bold ${result.color}`}>{result.level}</div>
            <div className="text-sm text-slate-400 mt-1">out of 27</div>
          </div>

          {/* Score bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ${result.barColor}`}
              style={{ width: `${(score / 27) * 100}%` }}
            />
          </div>

          <p className="text-slate-700 text-center mb-6 leading-relaxed">{result.desc}</p>

          <div className="bg-white/70 rounded-xl p-4 border border-white mb-6">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Disclaimer:</strong> This tool uses PHQ-9 screening criteria but is not a clinical
              assessment. Many factors affect mental health — a trained professional can provide a thorough
              evaluation and appropriate support.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/helplines" className="btn-primary">📞 Find Helplines</Link>
            <button onClick={reset} className="btn-secondary">Retake Quiz</button>
          </div>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="font-medium text-slate-600">{answered} / 9 answered</span>
            <span className="text-slate-400">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-8">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-mint-400 to-teal-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {QUESTIONS.map((question, qi) => (
              <div
                key={qi}
                className={`card border transition-all duration-200 ${
                  answers[qi] !== null ? 'border-mint-200 bg-mint-50/30' : 'border-slate-100'
                }`}
              >
                <p className="text-sm font-medium text-slate-700 mb-4 leading-relaxed">
                  <span className="inline-flex w-6 h-6 rounded-full bg-mint-100 text-mint-700 text-xs font-bold items-center justify-center mr-2 flex-shrink-0 align-middle">
                    {qi + 1}
                  </span>
                  {question}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FREQUENCY.map(({ value, label }) => (
                    <label
                      key={value}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all duration-150 text-center select-none ${
                        answers[qi] === value
                          ? 'border-mint-400 bg-mint-50 shadow-sm'
                          : 'border-slate-200 hover:border-mint-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${qi}`}
                        value={value}
                        checked={answers[qi] === value}
                        onChange={() => {
                          const next = [...answers];
                          next[qi] = value;
                          setAnswers(next);
                        }}
                        className="sr-only"
                      />
                      <span className={`text-lg font-bold ${answers[qi] === value ? 'text-mint-600' : 'text-slate-600'}`}>
                        {value}
                      </span>
                      <span className="text-xs text-slate-500 leading-tight">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={!allAnswered || submitting}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  'See My Results'
                )}
              </button>
              {!allAnswered && (
                <span className="text-xs text-slate-400">
                  {9 - answered} question{9 - answered !== 1 ? 's' : ''} remaining
                </span>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
