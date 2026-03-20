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
const MAX_ATTRIBUTES = 3;

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
  const { id }   = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

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
  const toggleAttribute = (slotId: string, attr: string) => {
    setGearAttributes((prev) => {
      const current  = prev[slotId] ?? [];
      const isActive = current.includes(attr);
      if (!isActive && current.length >= MAX_ATTRIBUTES) return prev;
      return {
        ...prev,
        [slotId]: isActive ? current.filter((a) => a !== attr) : [...current, attr],
      };
    });
  };

  const handleSave = () => {
    setSaving(true);
    saveBuild({ id, userId: user!.id, name: buildName, classId: selectedClass!, gears, gearAttributes });
    setTimeout(() => navigate('/dashboard'), 400);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">

      {/* ── Navbar ── */}
      <header className="bg-slate-900 border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between h-14 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-transparent border-none text-gray-500 cursor-pointer text-lg pr-1.5 leading-none hover:text-gray-300 transition-colors"
          >
            ←
          </button>
          <span className="text-xl">⛩️</span>
          <span className="text-amber-400 font-black text-sm sm:text-base tracking-widest">BUILD CREATOR</span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {['Class', 'Gear', 'Review'].map((label, i) => (
            <div key={label} className={`flex items-center gap-1 transition-opacity ${step === i ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold
                ${step > i ? 'bg-green-500 text-gray-950' : step === i ? 'bg-amber-400 text-gray-950' : 'bg-gray-700 text-gray-100'}`}>
                {step > i ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:inline ${step === i ? 'text-gray-300' : 'text-gray-600'}`}>{label}</span>
              {i < 2 && <span className="text-gray-700 text-xs mx-0.5">—</span>}
            </div>
          ))}
        </div>

        <div className="w-8 sm:w-[80px]" />
      </header>

      <div className="flex-1 flex overflow-hidden">

        {/* ══════ STEP 0 — CLASS SELECTION ══════ */}
        {step === STEP_CLASS && (
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
            <h2 className="text-xl sm:text-[22px] font-extrabold mb-1.5 text-center">Choose Your Class</h2>
            <p className="text-gray-500 text-sm text-center mb-6 sm:mb-8">
              Your class determines your base stats and unique perk.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-[700px] mx-auto">
              {CLASSES.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedClass(c.id)}
                  className={`rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-200
                    ${selectedClass === c.id ? 'bg-[#1e3a2f]' : 'bg-gray-900'}`}
                  style={{
                    border: `2px solid ${selectedClass === c.id ? c.color : '#1f2937'}`,
                    boxShadow: selectedClass === c.id ? `0 0 20px ${c.color}44` : 'none',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2.5 sm:mb-3">
                    <span className="text-3xl sm:text-4xl">{c.icon}</span>
                    <div>
                      <div
                        className="font-extrabold text-base sm:text-lg"
                        style={{ color: selectedClass === c.id ? c.accentColor : '#f3f4f6' }}
                      >
                        {c.name}
                      </div>
                      {selectedClass === c.id && (
                        <div className="text-[11px] font-semibold" style={{ color: c.accentColor }}>
                          SELECTED
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-400 leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <button
                disabled={!selectedClass}
                onClick={() => setStep(STEP_GEAR)}
                className={`border-none rounded-xl px-8 sm:px-12 py-3 sm:py-3.5 font-bold text-sm sm:text-[15px] tracking-widest transition-colors
                  ${selectedClass
                    ? 'bg-amber-400 text-gray-950 cursor-pointer hover:bg-amber-300'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
              >
                Choose Gear →
              </button>
            </div>
          </div>
        )}

        {/* ══════ STEP 1 — GEAR SELECTION ══════ */}
        {step === STEP_GEAR && (
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Sub-header */}
            <div className="bg-slate-900 border-b border-gray-800 px-4 py-2.5 flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-lg">{cls?.icon}</span>
                <span className="font-bold text-sm" style={{ color: cls?.accentColor ?? '#f59e0b' }}>
                  {cls?.name}
                </span>
              </div>
              <div className="flex-1 min-w-[120px]">
                <input
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-gray-100 text-sm w-full max-w-[280px] outline-none"
                  placeholder="Build name..."
                />
              </div>
              <span className="text-gray-500 text-xs sm:text-sm shrink-0">{gearsSelected}/7 slots</span>
            </div>

            {/* Mobile slot bar — horizontal scrollable slot picker */}
            <div className="flex md:hidden overflow-x-auto shrink-0 bg-[#0a0f1a] border-b border-gray-800 px-3 py-2 gap-2">
              {GEAR_SLOTS.map((slot) => {
                const equipped = gears[slot.id] ? getGearById(gears[slot.id]) : undefined;
                const isActive = activeSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => setActiveSlot(slot.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap
                      ${isActive
                        ? 'bg-[#1e3a5f] border-blue-500 text-blue-300'
                        : equipped
                          ? 'bg-gray-800 border-gray-700 text-gray-300'
                          : 'bg-gray-900 border-gray-800 text-gray-600'}`}
                  >
                    {equipped ? '✓ ' : ''}{slot.label}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 flex overflow-hidden">

              {/* ── Left sidebar: slot list + total stats (desktop only) ── */}
              <div className="hidden md:flex w-[230px] bg-[#0a0f1a] border-r border-gray-800 flex-col shrink-0">
                <div className="p-3.5 flex-1 overflow-y-auto">
                  <div className="text-[11px] text-gray-600 uppercase tracking-widest mb-2">Gear Slots</div>
                  {GEAR_SLOTS.map((slot) => {
                    const equipped = gears[slot.id] ? getGearById(gears[slot.id]) : undefined;
                    const isActive = activeSlot === slot.id;
                    return (
                      <div
                        key={slot.id}
                        onClick={() => setActiveSlot(slot.id)}
                        className={`px-3 py-2.5 rounded-lg mb-1 cursor-pointer transition-all duration-150
                          ${isActive ? 'bg-[#1e3a5f] border border-blue-500' : 'border border-transparent hover:bg-gray-800'}`}
                      >
                        <div className="text-[11px] text-gray-500 uppercase tracking-wide">{slot.label}</div>
                        {equipped ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm">{equipped.icon}</span>
                            <span
                              className="text-xs font-semibold truncate"
                              style={{ color: RARITY_COLOR[equipped.rarity] }}
                            >
                              {equipped.name}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-700 mt-0.5">— empty —</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {totalStats && (
                  <div className="px-3 py-3.5 border-t border-gray-800">
                    <div className="text-[11px] text-gray-600 uppercase tracking-widest mb-2">Total Stats</div>
                    {STAT_KEYS.map((k) => (
                      <StatBar key={k} stat={k} value={Math.min(totalStats[k], 100)} compact />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Right: gear grid + attribute panel ── */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                <div className="mb-3">
                  <h3 className="m-0 text-sm sm:text-base font-bold">
                    {activeSlotMeta?.label}{' '}
                    <span className="text-gray-500 text-xs sm:text-sm font-normal">— {activeSlotMeta?.category}</span>
                  </h3>
                  <p className="mt-1 text-gray-600 text-xs sm:text-[13px]">Select a weapon, then configure its attributes below.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gearsForActiveSlot.map((gear) => {
                    const isSelected = gears[activeSlot] === gear.id;
                    return (
                      <GearCard
                        key={gear.id}
                        gear={gear}
                        selected={isSelected}
                        onClick={() => {
                          const wasNew = gears[activeSlot] !== gear.id;
                          setGears((prev) => ({ ...prev, [activeSlot]: gear.id }));
                          if (wasNew) setGearAttributes((prev) => ({ ...prev, [activeSlot]: [] }));
                        }}
                        selectedAttributes={isSelected ? (gearAttributes[activeSlot] ?? []) : undefined}
                        onAttributeToggle={isSelected ? (attr) => toggleAttribute(activeSlot, attr) : undefined}
                        maxAttributes={MAX_ATTRIBUTES}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-900 border-t border-gray-800 px-4 sm:px-5 py-3 flex justify-between items-center gap-2">
              <button
                onClick={() => setStep(STEP_CLASS)}
                className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg px-3 sm:px-5 py-2 sm:py-2.5 cursor-pointer text-xs sm:text-sm font-semibold hover:text-gray-200 transition-colors whitespace-nowrap"
              >
                ← Change Class
              </button>
              <button
                disabled={!allGearSelected}
                onClick={() => setStep(STEP_REVIEW)}
                className={`border-none rounded-xl px-4 sm:px-7 py-2 sm:py-2.5 font-bold text-xs sm:text-sm transition-colors whitespace-nowrap
                  ${allGearSelected
                    ? 'bg-amber-400 text-gray-950 cursor-pointer hover:bg-amber-300'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
              >
                Review Build →
              </button>
            </div>
          </div>
        )}

        {/* ══════ STEP 2 — REVIEW ══════ */}
        {step === STEP_REVIEW && totalStats && (
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="max-w-[860px] mx-auto">
              <h2 className="text-xl sm:text-[22px] font-extrabold mb-1 text-center">Review Your Build</h2>
              <p className="text-gray-500 text-sm text-center mb-5 sm:mb-7">Confirm your selections before saving.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                {/* Left column */}
                <div>
                  {/* Build name */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5 mb-4">
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Build Name</div>
                    <input
                      value={buildName}
                      onChange={(e) => setBuildName(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-gray-100 text-base sm:text-lg font-bold w-full outline-none"
                    />
                  </div>

                  {/* Class */}
                  <div
                    className="bg-gray-900 rounded-xl p-4 sm:p-5 mb-4"
                    style={{ border: `1px solid ${cls?.color ?? '#1f2937'}66` }}
                  >
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2.5">Class</div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[28px] sm:text-[32px]">{cls?.icon}</span>
                      <div>
                        <div className="font-extrabold text-base sm:text-lg" style={{ color: cls?.accentColor }}>
                          {cls?.name}
                        </div>
                        <div className="text-xs text-gray-500">{cls?.description}</div>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-md px-2.5 py-1.5 text-xs text-amber-300">
                      ✦ {cls?.perk}
                    </div>
                  </div>

                  {/* Total stats */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5">
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Total Stats</div>
                    {STAT_KEYS.map((k) => (
                      <StatBar key={k} stat={k} value={Math.min(totalStats[k], 100)} />
                    ))}
                  </div>
                </div>

                {/* Right column — equipped gear */}
                <div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5">
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Equipped Gear</div>
                    <div className="flex flex-col gap-2.5">
                      {GEAR_SLOTS.map((slot) => {
                        const gear        = getGearById(gears[slot.id]);
                        const activeAttrs = gearAttributes[slot.id] ?? [];
                        return gear ? (
                          <div key={slot.id}>
                            <GearCard gear={gear} compact />
                            {activeAttrs.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5 pl-1">
                                {activeAttrs.map((attr) => (
                                  <span
                                    key={attr}
                                    className="px-2.5 py-0.5 rounded-full bg-amber-900 border border-amber-400 text-amber-200 text-[11px] font-semibold"
                                  >
                                    ✦ {attr}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div key={slot.id} className="px-3 py-2.5 bg-gray-800 rounded-lg text-gray-600 text-sm">
                            {slot.label}: Not selected
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-5 sm:mt-7 gap-3">
                <button
                  onClick={() => setStep(STEP_GEAR)}
                  className="bg-gray-800 border border-gray-700 text-gray-400 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 cursor-pointer text-xs sm:text-sm font-semibold hover:text-gray-200 transition-colors whitespace-nowrap"
                >
                  ← Back to Gear
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !buildName.trim()}
                  className={`border-none rounded-xl px-6 sm:px-10 py-2.5 sm:py-3 font-extrabold text-sm sm:text-[15px] tracking-widest transition-colors whitespace-nowrap
                    ${saving || !buildName.trim()
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-amber-400 text-gray-950 cursor-pointer hover:bg-amber-300'}`}
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
