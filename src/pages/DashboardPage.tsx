import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
    const gear = getGearById(build.gears?.[slot.id]);
    if (gear) (Object.keys(base) as StatKey[]).forEach((k) => (base[k] += gear.stats[k] ?? 0));
  });
  return base;
}

export default function DashboardPage() {
  const { user, logout }       = useAuth();
  const navigate               = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [builds, setBuilds]    = useState<Build[]>([]);

  const loadBuilds = () => setBuilds(getBuildsForUser(user!.id));
  useEffect(loadBuilds, [user]);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this build?')) {
      deleteBuild(id);
      loadBuilds();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">⛩️</span>
          <span className="text-amber-400 font-black text-base sm:text-lg tracking-widest">YOTEI LEGENDS</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-gray-500 text-sm hidden sm:block">
            ⚔️ <strong className="text-gray-700 dark:text-gray-200">{user?.username}</strong>
          </span>
          <button
            onClick={toggleTheme}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg px-3 sm:px-3.5 py-1.5 cursor-pointer text-sm hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg px-3 sm:px-3.5 py-1.5 cursor-pointer text-sm hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 sm:px-5 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-7">
          <div>
            <h2 className="m-0 text-xl sm:text-2xl font-extrabold">Your Builds</h2>
            <p className="mt-1 text-gray-500 text-sm">
              {builds.length} build{builds.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <button
            onClick={() => navigate('/builder')}
            className="bg-amber-400 text-gray-950 border-none rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 font-bold text-sm cursor-pointer tracking-widest hover:bg-amber-300 transition-colors self-start sm:self-auto"
          >
            + New Build
          </button>
        </div>

        {builds.length === 0 ? (
          <div className="text-center py-20 px-5 text-gray-400 dark:text-gray-600">
            <div className="text-6xl mb-4">🥷</div>
            <h3 className="text-xl text-gray-500 mb-2">No builds yet</h3>
            <p className="text-sm">Create your first character build to begin your legend.</p>
            <button
              onClick={() => navigate('/builder')}
              className="mt-5 bg-amber-400 text-gray-950 border-none rounded-xl px-7 py-3 font-bold text-sm cursor-pointer hover:bg-amber-300 transition-colors"
            >
              Create First Build
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 sm:gap-5">
            {builds.map((build) => {
              const cls   = getClassById(build.classId);
              const stats = computeTotalStats(build);
              return (
                <div
                  key={build.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transition-transform duration-150 cursor-pointer hover:-translate-y-0.5"
                  style={{ border: `1px solid ${(cls?.color ?? '#374151')}44` }}
                  onClick={() => navigate(`/builder/${build.id}`)}
                >
                  {/* Class header */}
                  <div
                    className="px-4 py-3.5 flex items-center gap-3"
                    style={{ background: cls?.color ?? '#374151' }}
                  >
                    <span className="text-[28px]">{cls?.icon ?? '❓'}</span>
                    <div>
                      <div className="font-extrabold text-base text-gray-950">{build.name}</div>
                      <div className="text-xs opacity-85 uppercase tracking-widest text-gray-950">
                        {cls?.name ?? 'Unknown Class'}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="px-4 py-3.5">
                    {(Object.entries(stats) as [StatKey, number][]).map(([stat, val]) => (
                      <StatBar key={stat} stat={stat} value={Math.min(val, 100)} compact />
                    ))}

                    <div className="mt-3.5 pt-3.5 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                      <span className="text-[11px] text-gray-400 dark:text-gray-600">
                        {new Date(build.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/builder/${build.id}`); }}
                          className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-md px-3 py-1 cursor-pointer text-xs hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(build.id); }}
                          className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 rounded-md px-3 py-1 cursor-pointer text-xs hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
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
