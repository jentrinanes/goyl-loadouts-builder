// Temporary one-time migration tool — delete this file and its usage in DashboardPage.tsx once the old backend's builds have been imported.
import { useState, type FormEvent } from 'react';
import { api, sanitize } from '../lib/api';
import type { Build } from '../types';

type LegacyBuild = Build & { userId: string };

export default function ImportLegacyBuilds({ onImported }: { onImported: () => void }) {
  const [open, setOpen]         = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus]     = useState<'idle' | 'loading' | 'error' | 'done'>('idle');
  const [error, setError]       = useState('');
  const [count, setCount]       = useState(0);

  const close = () => {
    setOpen(false);
    setUsername('');
    setPassword('');
    setStatus('idle');
    setError('');
  };

  const handleImport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    let token = '';
    try {
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const loginBody = await loginRes.json().catch(() => ({})) as { token?: string; message?: string };
      if (!loginRes.ok || !loginBody.token) {
        throw new Error(loginBody.message ?? 'Invalid username or password');
      }
      token = loginBody.token;

      const buildsRes = await fetch('/api/builds', { headers: { 'x-auth-token': token } });
      if (!buildsRes.ok) throw new Error('Failed to fetch builds from the old backend');
      const legacyBuilds = await buildsRes.json() as LegacyBuild[];

      for (const legacy of legacyBuilds) {
        const { id: _id, userId: _userId, createdAt: _createdAt, ...rest } = legacy;
        await api.builds.create(rest);
      }

      setCount(legacyBuilds.length);
      setStatus('done');
      onImported();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
      setStatus('error');
    } finally {
      if (token) {
        fetch('/api/auth/logout', { method: 'POST', headers: { 'x-auth-token': token } }).catch(() => { /* best effort */ });
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl px-4 py-2.5 sm:py-3 font-semibold text-sm cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors self-start sm:self-auto"
      >
        Import Old Builds
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60"
          onClick={close}
        >
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5">
              <h3 className="font-extrabold text-base mb-1">Import Old Builds</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Sign in with your old account to pull its builds into this browser. Run once — repeated imports will duplicate builds.
              </p>

              {status === 'done' ? (
                <div className="bg-green-50 dark:bg-green-950 border border-green-300 dark:border-green-700 rounded-lg px-3.5 py-2.5 text-green-700 dark:text-green-300 text-sm">
                  Imported {count} build{count !== 1 ? 's' : ''}.
                </div>
              ) : (
                <form onSubmit={handleImport}>
                  <div className="mb-3">
                    <label className="block text-gray-600 dark:text-gray-400 text-xs mb-1.5 uppercase tracking-widest">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(sanitize(e.target.value))}
                      maxLength={250}
                      required
                      className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-gray-900 dark:text-gray-100 text-sm outline-none"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-600 dark:text-gray-400 text-xs mb-1.5 uppercase tracking-widest">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(sanitize(e.target.value))}
                      maxLength={250}
                      required
                      className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-gray-900 dark:text-gray-100 text-sm outline-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-300 dark:border-red-600 rounded-lg px-3.5 py-2.5 text-red-600 dark:text-red-300 text-sm mb-4">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`w-full py-2.5 border-none rounded-lg text-sm font-bold cursor-pointer tracking-wide transition-colors
                      ${status === 'loading'
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-amber-400 text-gray-950 hover:bg-amber-300'}`}
                  >
                    {status === 'loading' ? 'Importing...' : 'Import'}
                  </button>
                </form>
              )}
            </div>
            <div className="px-6 pb-5 flex justify-end">
              <button
                onClick={close}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
