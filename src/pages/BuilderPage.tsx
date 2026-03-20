import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CLASSES, getClassById } from '../data/classes';
import { GEAR_SLOTS, getGearsByCategory, getGearById, RARITY_COLOR } from '../data/gear';
import { saveBuild, getBuildById } from '../store/buildStore';
import GearCard from '../components/GearCard';
import StatBar from '../components/StatBar';
import type { StatSet, StatKey } from '../types';

const STEP_CLASS  = 0;
const STEP_GEAR   = 1;
const STEP_REVIEW = 2;

const STAT_KEYS: StatKey[] = ['attack', 'defense', 'health', 'resolve', 'stealth', 'ranged'];

function computeTotalStats(classId: string | null, gears: Record<string, string>): StatSet {
  const base: StatSet = { attack: 0, defense: 0, health: 0, resolve: 0, stealth: 0, ranged: 0 };
  const cls = getClassById(classId);
  if (cls) STAT_KEYS.forEach((k) => (base[k] += cls.bonuses[k] ?? 0));
  GEAR_SLOTS.forEach((slot) => {
    const gear = getGearById(gears[slot.id]);
    if (gear) STAT_KEYS.forEach((k) => (base[k] += gear.stats[k] ?? 0));
  });
  return base;
}

export default function BuilderPage() {
  const { id }      = useParams<{ id: string }>();
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [step, setStep]                     = useState(STEP_CLASS);
  const [buildName, setBuildName]           = useState('My Build');
  const [selectedClass, setSelectedClass]   = useState<string | null>(null);
  const [gears, setGears]                   = useState<Record<string, string>>({});
  const [gearAttributes, setGearAttributes] = useState<Record<string, string[]>>({});
  const [activeSlot, setActiveSlot]         = useState(GEAR_SLOTS[0].id);
  const [saving, setSaving]                 = useState(false);

  useEffect(() => {
    if (id) {
      const existing = getBuildById(id);
      if (existing && existing.userId === user!.id) {
        setBuildName(existing.name);
        setSelectedClass(existing.classId);
        setGears(existing.gears ?? {});
        setGearAttributes(existing.gearAttributes ?? {});
        setStep(STEP_GEAR);
      }
    }
  }, [id, user]);

  const cls             = getClassById(selectedClass);
  const totalStats      = selectedClass ? computeTotalStats(selectedClass, gears) : null;
  const gearsSelected   = Object.keys(gears).length;
  const allGearSelected = gearsSelected === GEAR_SLOTS.length;

  const activeSlotMeta     = GEAR_SLOTS.find((s) => s.id === activeSlot);
  const slotWeaponType     = cls?.meleeSlotTypes?.[activeSlot];
  const gearsForActiveSlot = activeSlotMeta
    ? getGearsByCategory(activeSlotMeta.category, slotWeaponType)
    : [];
  const activeGear         = gears[activeSlot] ? getGearById(gears[activeSlot]) : undefined;

  const toggleAttribute = (slotId: string, attr: string) => {
    setGearAttributes((prev) => {
      const current = prev[slotId] ?? [];
      return {
        ...prev,
        [slotId]: current.includes(attr) ? current.filter((a) => a !== attr) : [...current, attr],
      };
    });
  };

  const handleSave = () => {
    setSaving(true);
    saveBuild({ id, userId: user!.id, name: buildName, classId: selectedClass!, gears, gearAttributes });
    setTimeout(() => navigate('/dashboard'), 400);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#f3f4f6', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid #1f2937', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 18, padding: '0 8px 0 0', lineHeight: 1 }}>←</button>
          <span style={{ fontSize: 20 }}>⛩️</span>
          <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: 16, letterSpacing: 2 }}>BUILD CREATOR</span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['Class', 'Gear', 'Review'].map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: step === i ? 1 : 0.4 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: step > i ? '#22c55e' : step === i ? '#f59e0b' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#030712' }}>
                {step > i ? '✓' : i + 1}
              </div>
              {i < 2 && <span style={{ color: '#374151' }}>—</span>}
            </div>
          ))}
        </div>

        <div style={{ width: 120 }} />
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ====== STEP 0: CLASS SELECTION ====== */}
        {step === STEP_CLASS && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, textAlign: 'center' }}>Choose Your Class</h2>
            <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
              Your class determines your base stats and unique perk.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 700, margin: '0 auto' }}>
              {CLASSES.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedClass(c.id)}
                  style={{
                    background: selectedClass === c.id ? '#1e3a2f' : '#111827',
                    border: `2px solid ${selectedClass === c.id ? c.color : '#1f2937'}`,
                    borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: selectedClass === c.id ? `0 0 20px ${c.color}44` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 36 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: selectedClass === c.id ? c.accentColor : '#f3f4f6' }}>
                        {c.name}
                      </div>
                      {selectedClass === c.id && (
                        <div style={{ fontSize: 11, color: c.accentColor, fontWeight: 600 }}>SELECTED</div>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.5 }}>{c.description}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button
                disabled={!selectedClass}
                onClick={() => setStep(STEP_GEAR)}
                style={{ background: selectedClass ? '#f59e0b' : '#374151', color: selectedClass ? '#030712' : '#6b7280', border: 'none', borderRadius: 10, padding: '14px 48px', fontWeight: 700, fontSize: 15, cursor: selectedClass ? 'pointer' : 'not-allowed', letterSpacing: 1 }}
              >
                Choose Gear →
              </button>
            </div>
          </div>
        )}

        {/* ====== STEP 1: GEAR SELECTION ====== */}
        {step === STEP_GEAR && (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
            <div style={{ background: '#0f172a', borderBottom: '1px solid #1f2937', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{cls?.icon}</span>
                <span style={{ color: cls?.accentColor ?? '#f59e0b', fontWeight: 700, fontSize: 14 }}>{cls?.name}</span>
              </div>
              <div style={{ flex: 1 }}>
                <input
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 6, padding: '5px 12px', color: '#f3f4f6', fontSize: 14, width: '100%', maxWidth: 280, outline: 'none', boxSizing: 'border-box' }}
                  placeholder="Build name..."
                />
              </div>
              <span style={{ color: '#6b7280', fontSize: 13 }}>{gearsSelected}/7 gear slots filled</span>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* Left: slot list + totals */}
              <div style={{ width: 230, background: '#0a0f1a', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: '14px 12px', flex: 1, overflowY: 'auto' }}>
                  <div style={{ fontSize: 11, color: '#4b5563', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Gear Slots</div>
                  {GEAR_SLOTS.map((slot) => {
                    const equipped = gears[slot.id] ? getGearById(gears[slot.id]) : undefined;
                    return (
                      <div
                        key={slot.id}
                        onClick={() => setActiveSlot(slot.id)}
                        style={{ padding: '10px 12px', borderRadius: 8, marginBottom: 4, cursor: 'pointer', background: activeSlot === slot.id ? '#1e3a5f' : 'transparent', border: `1px solid ${activeSlot === slot.id ? '#3b82f6' : 'transparent'}`, transition: 'all 0.15s' }}
                      >
                        <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{slot.label}</div>
                        {equipped ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                            <span style={{ fontSize: 14 }}>{equipped.icon}</span>
                            <span style={{ fontSize: 12, color: RARITY_COLOR[equipped.rarity], fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {equipped.name}
                            </span>
                          </div>
                        ) : (
                          <div style={{ fontSize: 12, color: '#374151', marginTop: 3 }}>— empty —</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {totalStats && (
                  <div style={{ padding: '14px 12px', borderTop: '1px solid #1f2937' }}>
                    <div style={{ fontSize: 11, color: '#4b5563', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Total Stats</div>
                    {STAT_KEYS.map((k) => (
                      <StatBar key={k} stat={k} value={Math.min(totalStats[k], 100)} compact />
                    ))}
                  </div>
                )}
              </div>

              {/* Right: gear list + attribute panel */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                    {activeSlotMeta?.label} — <span style={{ color: '#6b7280', fontSize: 14, fontWeight: 400 }}>{activeSlotMeta?.category}</span>
                  </h3>
                  <p style={{ margin: '4px 0 0', color: '#4b5563', fontSize: 13 }}>Select a weapon, then configure its attributes below.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12, marginBottom: 20 }}>
                  {gearsForActiveSlot.map((gear) => (
                    <GearCard
                      key={gear.id}
                      gear={gear}
                      selected={gears[activeSlot] === gear.id}
                      onClick={() => {
                        const wasNew = gears[activeSlot] !== gear.id;
                        setGears((prev) => ({ ...prev, [activeSlot]: gear.id }));
                        if (wasNew) setGearAttributes((prev) => ({ ...prev, [activeSlot]: [] }));
                        const currentIdx = GEAR_SLOTS.findIndex((s) => s.id === activeSlot);
                        const nextEmpty  = GEAR_SLOTS.find((s, i) => i > currentIdx && !gears[s.id] && s.id !== activeSlot);
                        if (nextEmpty) setActiveSlot(nextEmpty.id);
                      }}
                    />
                  ))}
                </div>

                {activeGear && (
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 18 }}>{activeGear.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: RARITY_COLOR[activeGear.rarity] }}>{activeGear.name}</div>
                        <div style={{ fontSize: 11, color: '#4b5563' }}>Select attributes to activate</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {activeGear.attributes.map((attr) => {
                        const active = (gearAttributes[activeSlot] ?? []).includes(attr);
                        return (
                          <button
                            key={attr}
                            onClick={() => toggleAttribute(activeSlot, attr)}
                            style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${active ? '#f59e0b' : '#374151'}`, background: active ? '#78350f' : '#1f2937', color: active ? '#fde68a' : '#6b7280', fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}
                          >
                            {active ? '✦ ' : ''}{attr}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: '#0f172a', borderTop: '1px solid #1f2937', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setStep(STEP_CLASS)} style={{ background: '#1f2937', border: '1px solid #374151', color: '#9ca3af', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                ← Change Class
              </button>
              <button
                disabled={!allGearSelected}
                onClick={() => setStep(STEP_REVIEW)}
                style={{ background: allGearSelected ? '#f59e0b' : '#374151', color: allGearSelected ? '#030712' : '#6b7280', border: 'none', borderRadius: 10, padding: '10px 28px', fontWeight: 700, fontSize: 14, cursor: allGearSelected ? 'pointer' : 'not-allowed' }}
              >
                Review Build →
              </button>
            </div>
          </div>
        )}

        {/* ====== STEP 2: REVIEW ====== */}
        {step === STEP_REVIEW && totalStats && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px' }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, textAlign: 'center' }}>Review Your Build</h2>
              <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 28 }}>Confirm your selections before saving.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Build Name</div>
                    <input
                      value={buildName}
                      onChange={(e) => setBuildName(e.target.value)}
                      style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, padding: '10px 14px', color: '#f3f4f6', fontSize: 18, fontWeight: 700, width: '100%', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ background: '#111827', border: `1px solid ${cls?.color ?? '#1f2937'}66`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Class</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <span style={{ fontSize: 32 }}>{cls?.icon}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 18, color: cls?.accentColor }}>{cls?.name}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{cls?.description}</div>
                      </div>
                    </div>
                    <div style={{ background: '#0f172a', borderRadius: 6, padding: '6px 10px', fontSize: 12, color: '#fbbf24' }}>
                      ✦ {cls?.perk}
                    </div>
                  </div>

                  <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Total Stats</div>
                    {STAT_KEYS.map((k) => (
                      <StatBar key={k} stat={k} value={Math.min(totalStats[k], 100)} />
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Equipped Gear</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {GEAR_SLOTS.map((slot) => {
                        const gear        = getGearById(gears[slot.id]);
                        const activeAttrs = gearAttributes[slot.id] ?? [];
                        return gear ? (
                          <div key={slot.id}>
                            <GearCard gear={gear} compact />
                            {activeAttrs.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6, paddingLeft: 4 }}>
                                {activeAttrs.map((attr) => (
                                  <span key={attr} style={{ padding: '3px 10px', borderRadius: 20, background: '#78350f', border: '1px solid #f59e0b', color: '#fde68a', fontSize: 11, fontWeight: 600 }}>
                                    ✦ {attr}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div key={slot.id} style={{ padding: '10px 12px', background: '#1f2937', borderRadius: 8, color: '#4b5563', fontSize: 13 }}>
                            {slot.label}: Not selected
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
                <button onClick={() => setStep(STEP_GEAR)} style={{ background: '#1f2937', border: '1px solid #374151', color: '#9ca3af', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                  ← Back to Gear
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !buildName.trim()}
                  style={{ background: saving ? '#374151' : '#f59e0b', color: saving ? '#6b7280' : '#030712', border: 'none', borderRadius: 10, padding: '12px 40px', fontWeight: 800, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer', letterSpacing: 1 }}
                >
                  {saving ? 'Saving...' : '💾 Save Build'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
