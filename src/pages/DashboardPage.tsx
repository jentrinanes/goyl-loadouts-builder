import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBuildsForUser, deleteBuild } from '../store/buildStore';
import { getClassById } from '../data/classes';
import { getGearById, GEAR_SLOTS } from '../data/gear';
import StatBar from '../components/StatBar';
import type { Build, StatSet, StatKey } from '../types';

function computeTotalStats(build: Build): StatSet {
  const base: StatSet = { attack: 0, defense: 0, health: 0, resolve: 0, stealth: 0, ranged: 0 };
  const cls = getClassById(build.classId);
  if (cls) (Object.keys(base) as StatKey[]).forEach((k) => (base[k] += cls.bonuses[k] ?? 0));
  GEAR_SLOTS.forEach((slot) => {
    const gearId = build.gears?.[slot.id];
    if (gearId) {
      const gear = getGearById(gearId);
      if (gear) (Object.keys(base) as StatKey[]).forEach((k) => (base[k] += gear.stats[k] ?? 0));
    }
  });
  return base;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [builds, setBuilds] = useState<Build[]>([]);

  const loadBuilds = () => setBuilds(getBuildsForUser(user!.id));
  useEffect(loadBuilds, [user]);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this build?')) {
      deleteBuild(id);
      loadBuilds();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#f3f4f6' }}>
      {/* Navbar */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid #1f2937', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>⛩️</span>
          <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: 18, letterSpacing: 2 }}>YOTEI LEGENDS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#6b7280', fontSize: 13 }}>
            ⚔️ <strong style={{ color: '#e5e7eb' }}>{user?.username}</strong>
          </span>
          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{ background: '#1f2937', border: '1px solid #374151', color: '#9ca3af', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Your Builds</h2>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>
              {builds.length} build{builds.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <button
            onClick={() => navigate('/builder')}
            style={{ background: '#f59e0b', color: '#030712', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer', letterSpacing: 1 }}
          >
            + New Build
          </button>
        </div>

        {builds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#4b5563' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🥷</div>
            <h3 style={{ fontSize: 20, color: '#6b7280', marginBottom: 8 }}>No builds yet</h3>
            <p style={{ fontSize: 14 }}>Create your first character build to begin your legend.</p>
            <button
              onClick={() => navigate('/builder')}
              style={{ marginTop: 20, background: '#f59e0b', color: '#030712', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              Create First Build
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {builds.map((build) => {
              const cls   = getClassById(build.classId);
              const stats = computeTotalStats(build);
              return (
                <div
                  key={build.id}
                  style={{ background: '#111827', border: `1px solid ${cls?.color ?? '#1f2937'}44`, borderRadius: 14, overflow: 'hidden', transition: 'transform 0.15s', cursor: 'pointer' }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseOut={(e)  => (e.currentTarget.style.transform = 'translateY(0)')}
                  onClick={() => navigate(`/builder/${build.id}`)}
                >
                  <div style={{ background: cls?.color ?? '#374151', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{cls?.icon ?? '❓'}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{build.name}</div>
                      <div style={{ fontSize: 12, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {cls?.name ?? 'Unknown Class'}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '14px 18px' }}>
                    {(Object.entries(stats) as [StatKey, number][]).map(([stat, val]) => (
                      <StatBar key={stat} stat={stat} value={Math.min(val, 100)} compact />
                    ))}

                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#4b5563' }}>
                        {new Date(build.createdAt).toLocaleDateString()}
                      </span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/builder/${build.id}`); }}
                          style={{ background: '#1f2937', border: '1px solid #374151', color: '#9ca3af', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 12 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(build.id); }}
                          style={{ background: '#450a0a', border: '1px solid #7f1d1d', color: '#fca5a5', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 12 }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
