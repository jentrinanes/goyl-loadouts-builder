import { RARITY_COLOR } from '../data/gear';
import GearIcon from './WeaponIcon';
import type { Gear } from '../types';

interface GearCardProps {
  gear: Gear;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  selectedAttributes?: string[];
  onAttributeToggle?: (attr: string) => void;
  maxAttributes?: number;
}

export default function GearCard({
  gear,
  selected = false,
  onClick,
  compact = false,
  selectedAttributes,
  onAttributeToggle,
  maxAttributes = 3,
}: GearCardProps) {
  const rarityColor    = RARITY_COLOR[gear.rarity] ?? '#9ca3af';
  const showAttributes = selected && !compact && onAttributeToggle && gear.attributes.length > 0;

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
        {/* Header row */}
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

        {/* Description */}
        {!compact && (
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            {gear.description}
          </p>
        )}

        {/* Inline attribute selector — only when selected */}
        {showAttributes && (
          <div
            className="mt-3 pt-3 border-t border-blue-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-gray-500 uppercase tracking-widest">Attributes</span>
              <span className={`text-[11px] font-semibold ${
                (selectedAttributes?.length ?? 0) >= maxAttributes ? 'text-amber-400' : 'text-gray-600'
              }`}>
                {selectedAttributes?.length ?? 0} / {maxAttributes}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {gear.attributes.map((attr) => {
                const active = selectedAttributes?.includes(attr) ?? false;
                const capped = !active && (selectedAttributes?.length ?? 0) >= maxAttributes;
                return (
                  <button
                    key={attr}
                    onClick={() => onAttributeToggle(attr)}
                    disabled={capped}
                    className={`px-3 py-1 rounded-full text-xs border transition-all duration-150
                      ${active
                        ? 'bg-amber-900 border-amber-400 text-amber-200 font-semibold cursor-pointer'
                        : capped
                          ? 'bg-gray-800 border-gray-800 text-gray-700 cursor-not-allowed'
                          : 'bg-gray-800 border-gray-700 text-gray-500 cursor-pointer hover:border-gray-500 hover:text-gray-300'}`}
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
  );
}
