import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getBuildsForUser, deleteBuild, duplicateBuild } from '../store/buildStore';
import { getClassById } from '../data/classes';
import { getGearById, getSlotsForClass, RARITY_COLOR } from '../data/gear';
import type { Build } from '../types';

// ─── Share card (rendered off-screen, captured as PNG) ───────────────────────

function ShareCard({ build, theme }: { build: Build; theme: 'light' | 'dark' }) {
  const cls  = getClassById(build.classId);
  const dark = theme === 'dark';

  const bg         = dark ? '#0f172a' : '#ffffff';
  const bodyBg     = dark ? '#0f172a' : '#ffffff';
  const divider    = dark ? '#1e293b' : '#e5e7eb';
  const labelColor = dark ? '#64748b' : '#9ca3af';
  const slotLabel  = dark ? '#475569' : '#9ca3af';
  const techFixed  = dark ? '#64748b' : '#9ca3af';
  const techSelect = dark ? '#fbbf24' : '#b45309';
  const attrBg     = dark ? '#451a03' : '#fef3c7';
  const attrBorder = dark ? '#92400e' : '#fcd34d';
  const attrText   = dark ? '#fcd34d' : '#92400e';

  return (
    <div
      style={{
        width: 420,
        background: bg,
        borderRadius: 20,
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
        border: `2px solid ${cls?.color ?? '#374151'}88`,
      }}
    >
      {/* Header */}
      <div style={{ background: cls?.color ?? '#374151', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 36 }}>{cls?.icon ?? '❓'}</span>
        <div>
          <div style={{ fontWeight: 900, fontSize: 20, color: '#0f172a' }}>{build.name}</div>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#0f172a', opacity: 0.75 }}>
            {cls?.name ?? 'Unknown Class'}
          </div>
        </div>
      </div>

      <div style={{ padding: '18px 20px', background: bodyBg }}>
        {/* Gear */}
        <div style={{ fontSize: 10, color: labelColor, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 10 }}>Gear</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginBottom: 4 }}>
          {getSlotsForClass(build.classId).map((slot) => {
            const gear  = getGearById(build.gears?.[slot.id]);
            const attrs = (build.gearAttributes?.[slot.id] ?? []).filter(Boolean);
            if (!gear) return null;
            return (
              <div key={slot.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>{gear.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: RARITY_COLOR[gear.rarity] }}>{gear.name}</span>
                </div>
                {attrs.length > 0 && (
                  <div style={{ paddingLeft: 20, marginTop: 3, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {attrs.map((attr) => (
                      <span key={attr} style={{
                        fontSize: 10, fontWeight: 600, padding: '1px 6px',
                        borderRadius: 999, background: attrBg,
                        border: `1px solid ${attrBorder}`, color: attrText,
                      }}>
                        {attr}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Techniques */}
        {cls?.techniques && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${divider}` }}>
            <div style={{ fontSize: 10, color: labelColor, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 10 }}>Techniques</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {cls.techniques.map(({ slot, default: def }) => {
                const selected = def ?? build.techniques?.[slot];
                if (!selected) return null;
                return (
                  <div key={slot} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 10, color: slotLabel, fontWeight: 700, width: 16 }}>T{slot}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: def ? techFixed : techSelect }}>{selected}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, logout }            = useAuth();
  const navigate                    = useNavigate();
  const { theme, toggleTheme }      = useTheme();
  const [builds, setBuilds]           = useState<Build[]>([]);
  const [shareBuild, setShareBuild]   = useState<Build | null>(null);
  const [deleteBuildId, setDeleteBuildId] = useState<string | null>(null);
  const [capturing, setCapturing]     = useState(false);
  const shareCardRef                  = useRef<HTMLDivElement>(null);

  const loadBuilds = () => setBuilds(getBuildsForUser(user!.id));
  useEffect(loadBuilds, [user]);

  const handleDelete = () => {
    if (!deleteBuildId) return;
    deleteBuild(deleteBuildId);
    setDeleteBuildId(null);
    loadBuilds();
  };

  const handleDuplicate = (id: string) => {
    duplicateBuild(id);
    loadBuilds();
  };

  const handleDownload = async () => {
    if (!shareCardRef.current || !shareBuild) return;
    setCapturing(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, { pixelRatio: 2 });
      const link    = document.createElement('a');
      link.download = `${shareBuild.name.replace(/\s+/g, '_')}_build.png`;
      link.href     = dataUrl;
      link.click();
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">⛩️</span>
          <span className="text-amber-400 font-black text-base sm:text-lg tracking-widest">GOYL BUILD CREATOR</span>
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
              const cls = getClassById(build.classId);
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

                  {/* Gear + Techniques */}
                  <div className="px-4 py-3.5">
                    <div className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2">Gear</div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-1">
                      {getSlotsForClass(build.classId).map((slot) => {
                        const gear = getGearById(build.gears?.[slot.id]);
                        return gear ? (
                          <div key={slot.id} className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm shrink-0">{gear.icon}</span>
                            <span className="text-[11px] font-semibold truncate" style={{ color: RARITY_COLOR[gear.rarity] }}>
                              {gear.name}
                            </span>
                          </div>
                        ) : (
                          <div key={slot.id} className="text-[11px] text-gray-300 dark:text-gray-700 italic truncate">
                            {slot.label}: empty
                          </div>
                        );
                      })}
                    </div>

                    {cls?.techniques && (
                      <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800">
                        <div className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2">Techniques</div>
                        <div className="flex flex-col gap-1">
                          {cls.techniques.map(({ slot, default: def }) => {
                            const selected = def ?? build.techniques?.[slot];
                            return selected ? (
                              <div key={slot} className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 dark:text-gray-600 font-bold w-4 shrink-0">T{slot}</span>
                                <span className={`text-[11px] font-semibold ${def ? 'text-gray-500 dark:text-gray-500' : 'text-amber-600 dark:text-amber-300'}`}>
                                  {selected}
                                </span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    <div className="mt-3.5 pt-3.5 border-t border-gray-200 dark:border-gray-800 flex flex-wrap justify-end items-center gap-y-2">
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); setShareBuild(build); }}
                          className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-md px-2.5 py-1 cursor-pointer text-xs hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        >
                          Share
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/builder/${build.id}`); }}
                          className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-md px-2.5 py-1 cursor-pointer text-xs hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDuplicate(build.id); }}
                          className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-md px-2.5 py-1 cursor-pointer text-xs hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        >
                          Copy
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteBuildId(build.id); }}
                          className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 rounded-md px-2.5 py-1 cursor-pointer text-xs hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
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

      {/* Share modal */}
      {shareBuild && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60"
          onClick={() => setShareBuild(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
              <div>
                <h3 className="font-extrabold text-base">Share Build</h3>
                <p className="text-xs text-gray-500 mt-0.5">Download as an image to share anywhere</p>
              </div>
              <button
                onClick={() => setShareBuild(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer bg-transparent border-none transition-colors"
              >
                ×
              </button>
            </div>

            {/* Share card preview — scrollable so 420px card is always reachable */}
            <div className="flex-1 overflow-auto py-5 px-5 flex justify-center bg-gray-100 dark:bg-gray-950">
              <div ref={shareCardRef} className="shrink-0">
                <ShareCard build={shareBuild} theme={theme} />
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end shrink-0">
              <button
                onClick={handleDownload}
                disabled={capturing}
                className={`border-none rounded-xl px-6 py-2.5 font-bold text-sm cursor-pointer tracking-wide transition-colors w-full sm:w-auto
                  ${capturing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-amber-400 text-gray-950 hover:bg-amber-300'}`}
              >
                {capturing ? 'Capturing...' : '📥 Download Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteBuildId && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60"
          onClick={() => setDeleteBuildId(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5">
              <h3 className="font-extrabold text-base mb-1">Delete Build</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {builds.find((b) => b.id === deleteBuildId)?.name ?? 'this build'}
                </span>
                ? This cannot be undone.
              </p>
            </div>
            <div className="px-6 pb-5 flex gap-2 justify-end">
              <button
                onClick={() => setDeleteBuildId(null)}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-500 text-white border-none rounded-xl px-4 py-2 text-sm font-bold cursor-pointer transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
