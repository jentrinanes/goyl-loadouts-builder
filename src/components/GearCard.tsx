import { RARITY_COLOR } from '../data/gear';
import GearIcon from './WeaponIcon';
import type { Gear } from '../types';

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
      className={`relative overflow-hidden rounded-xl transition-all duration-200
        ${compact ? 'px-3 py-2.5' : 'p-4'}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
        ${selected ? 'bg-[#1e3a5f]' : 'bg-gray-900'}`}
      style={{
        border: `2px solid ${selected ? '#60a5fa' : rarityColor + '55'}`,
        boxShadow: selected ? '0 0 12px #60a5fa66' : 'none',
      }}
    >
      {/* Rarity stripe */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
        style={{ background: rarityColor }}
      />

      <div className="pl-2">
        <div className={`flex items-center gap-2 ${compact ? '' : 'mb-1'}`}>
          <GearIcon
            weaponType={gear.weaponType}
            fallback={gear.icon}
            size={compact ? 18 : 24}
            color={rarityColor}
          />
          <div className="flex-1">
            <div className={`font-bold text-gray-100 ${compact ? 'text-[13px]' : 'text-[15px]'}`}>
              {gear.name}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: rarityColor }}>
              {gear.rarity} · {gear.category}
            </div>
          </div>
          {selected && (
            <span className="text-blue-400 text-lg font-bold">✓</span>
          )}
        </div>

        {!compact && (
          <p className="text-xs text-gray-400 mt-1.5 mb-2.5 leading-relaxed">
            {gear.description}
          </p>
        )}
      </div>
    </div>
  );
}
