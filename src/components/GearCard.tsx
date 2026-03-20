import { RARITY_COLOR } from '../data/gear';
import StatBar from './StatBar';
import type { Gear, StatKey } from '../types';

interface GearCardProps {
  gear: Gear;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export default function GearCard({ gear, selected = false, onClick, compact = false }: GearCardProps) {
  const rarityColor = RARITY_COLOR[gear.rarity] ?? '#9ca3af';

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? '#1e3a5f' : '#111827',
        border: `2px solid ${selected ? '#60a5fa' : rarityColor + '55'}`,
        borderRadius: 10,
        padding: compact ? '10px 12px' : 16,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        boxShadow: selected ? '0 0 12px #60a5fa66' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Rarity stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          background: rarityColor,
          borderRadius: '10px 0 0 10px',
        }}
      />

      <div style={{ paddingLeft: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: compact ? 18 : 24 }}>{gear.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: compact ? 13 : 15, color: '#f3f4f6' }}>
              {gear.name}
            </div>
            <div style={{ fontSize: 11, color: rarityColor, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {gear.rarity} · {gear.category}
            </div>
          </div>
          {selected && (
            <span style={{ color: '#60a5fa', fontSize: 18, fontWeight: 700 }}>✓</span>
          )}
        </div>

        {!compact && (
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '6px 0 10px', lineHeight: 1.5 }}>
            {gear.description}
          </p>
        )}

        <div style={{ marginBottom: compact ? 0 : 8 }}>
          {(Object.entries(gear.stats) as [StatKey, number][])
            .filter(([, v]) => v > 0)
            .map(([stat, value]) => (
              <StatBar key={stat} stat={stat} value={value} compact />
            ))}
        </div>

        {!compact && (
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 12,
              color: '#fbbf24',
              marginTop: 8,
            }}
          >
            ✦ {gear.perk}
          </div>
        )}
      </div>
    </div>
  );
}
