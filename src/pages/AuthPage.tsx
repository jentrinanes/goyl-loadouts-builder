import { useState, type FormEvent, type MouseEvent } from 'react';
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        login(username, password);
      } else {
        if (username.length < 3) { setError('Username must be at least 3 characters'); return; }
        if (password.length < 4) { setError('Password must be at least 4 characters'); return; }
        register(username, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleHover = (e: MouseEvent<HTMLButtonElement>, opacity: number) => {
    (e.target as HTMLButtonElement).style.opacity = String(opacity);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>⛩️</div>
        <h1 style={{ color: '#f59e0b', fontSize: 32, fontWeight: 900, letterSpacing: 2, margin: 0, textShadow: '0 0 30px #f59e0b88' }}>
          YOTEI LEGENDS
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6, letterSpacing: 3, textTransform: 'uppercase' }}>
          Build Creator
        </p>
      </div>

      <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16, padding: 36, width: '100%', maxWidth: 400, boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: 28, background: '#0f172a', borderRadius: 8, padding: 4, gap: 4 }}>
          {(['login', 'register'] as AuthMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                background: mode === m ? '#f59e0b' : 'transparent',
                color: mode === m ? '#030712' : '#6b7280',
                textTransform: 'capitalize',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: 8, padding: '10px 14px', color: '#f3f4f6', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              placeholder="Enter your username"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: 8, padding: '10px 14px', color: '#f3f4f6', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div style={{ background: '#450a0a', border: '1px solid #dc2626', borderRadius: 8, padding: '10px 14px', color: '#fca5a5', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            onMouseOver={(e) => handleHover(e, 0.85)}
            onMouseOut={(e)  => handleHover(e, 1)}
            style={{
              width: '100%', padding: '12px 0', background: '#f59e0b', color: '#030712',
              border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
              letterSpacing: 1, textTransform: 'uppercase', transition: 'opacity 0.2s',
            }}
          >
            {mode === 'login' ? 'Enter the Legend' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
