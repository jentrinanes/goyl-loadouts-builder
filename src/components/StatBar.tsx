import type { StatKey } from '../types';

interface StatMeta {
  label: string;
  color: string;
}

const STAT_LABELS: Record<StatKey, StatMeta> = {
  attack:  { label: 'Attack',  color: '#ef4444' },
  defense: { label: 'Defense', color: '#3b82f6' },
  health:  { label: 'Health',  color: '#22c55e' },
  resolve: { label: 'Resolve', color: '#f59e0b' },
  stealth: { label: 'Stealth', color: '#8b5cf6' },
  ranged:  { label: 'Ranged',  color: '#06b6d4' },
};

const MAX_STAT = 100;

interface StatBarProps {
  stat: StatKey;
  value: number;
  compact?: boolean;
}

export default function StatBar({ stat, value, compact = false }: StatBarProps) {
  const meta = STAT_LABELS[stat];
  if (!meta) return null;

  return (
    <div style={{ marginBottom: compact ? 4 : 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontSize: compact ? 11 : 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>
          {meta.label}
        </span>
        <span style={{ fontSize: compact ? 11 : 12, color: '#e5e7eb', fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ background: '#1f2937', borderRadius: 4, height: compact ? 4 : 6, overflow: 'hidden' }}>
        <div
          style={{
            width: `${Math.min((value / MAX_STAT) * 100, 100)}%`,
            height: '100%',
            background: meta.color,
            borderRadius: 4,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
}
