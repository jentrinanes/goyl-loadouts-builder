import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode]         = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const { login, register }     = useAuth();
  const navigate                = useNavigate();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center justify-center p-5">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-2">⛩️</div>
        <h1
          className="text-amber-400 text-3xl font-black tracking-widest m-0"
          style={{ textShadow: '0 0 30px #f59e0b88' }}
        >
          GOYL Build Creator
        </h1>
        {import.meta.env.VITE_APP_ENV === 'staging' && (
          <span className="mt-2 bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">staging</span>
        )}
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-9 w-full max-w-sm shadow-2xl">
        {/* Tabs */}
        <div className="flex mb-7 bg-gray-100 dark:bg-slate-900 rounded-lg p-1 gap-1">
          {(['login', 'register'] as AuthMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-2 rounded-md border-none cursor-pointer font-semibold text-sm transition-all
                ${mode === m
                  ? 'bg-amber-400 text-gray-950'
                  : 'bg-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 dark:text-gray-400 text-xs mb-1.5 uppercase tracking-widest">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-gray-900 dark:text-gray-100 text-base outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-600 dark:text-gray-400 text-xs mb-1.5 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-gray-900 dark:text-gray-100 text-base outline-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-300 dark:border-red-600 rounded-lg px-3.5 py-2.5 text-red-600 dark:text-red-300 text-sm mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-amber-400 text-gray-950 border-none rounded-lg text-base font-bold cursor-pointer tracking-widest uppercase transition-opacity hover:opacity-85"
          >
            {mode === 'login' ? 'Enter' : 'Create Account'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-gray-500 dark:text-gray-600 text-xs tracking-wide text-center">
        Fan-made tool. Not affiliated with Sucker Punch Productions.
      </p>
    </div>
  );
}
