import { useState, useEffect } from 'react';
import { RARITY_COLOR } from '../data/gear';
import { useTheme } from '../context/ThemeContext';
import type { Gear } from '../types';

interface GearCardProps {
  gear: Gear;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  disabled?: boolean;
  selectedAttributes?: [string, string, string];
  onAttributeChange?: (index: 0 | 1 | 2, value: string) => void;
  displayAttributes?: string[];
}

export default function GearCard({
  gear,
  selected = false,
  onClick,
  compact = false,
  disabled = false,
  selectedAttributes,
  onAttributeChange,
  displayAttributes,
}: GearCardProps) {
  const { theme } = useTheme();
  const [imgSrc, setImgSrc] = useState(theme === 'dark' ? `/images/${gear.id}_dark.webp` : null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgSrc(theme === 'dark' ? `/images/${gear.id}_dark.webp` : null);
    setImgError(false);
  }, [gear.id, theme]);

  const handleImgError = () => {
    if (imgSrc?.endsWith('.webp')) {
      setImgSrc(`/images/${gear.id}_dark.png`);
    } else {
      setImgError(true);
    }
  };
  const rarityColor    = RARITY_COLOR[gear.rarity] ?? '#9ca3af';
  const showAttributes = selected && !compact && !!onAttributeChange;

  const attrOptions: string[][] = [gear.attributes1, gear.attributes2, gear.attributes3];
  const attrLabels = ['Top Slot', 'Bottom Slot', 'Perk'];

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`relative overflow-hidden rounded-xl transition-all duration-200
        ${compact ? 'px-3 py-2.5' : 'p-4'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : onClick ? 'cursor-pointer' : 'cursor-default'}
        ${selected ? 'bg-blue-50 dark:bg-[#1e3a5f]' : 'bg-white dark:bg-gray-900'}`}
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
        <div className="flex items-center gap-2 w-full">
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={gear.name}
              onError={handleImgError}
              style={{ width: compact ? 30 : 36, height: compact ? 30 : 36, objectFit: 'contain' }}
            />
          ) : (
            <span style={{ fontSize: compact ? 22 : 28 }}>{gear.icon}</span>
          )}
          <div className="w-1/2 min-w-0">
            <div className={`font-bold text-gray-900 dark:text-gray-100 ${compact ? 'text-[13px]' : 'text-[15px]'}`}>
              {gear.name}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: rarityColor }}>
              {gear.rarity} · {gear.category}
            </div>
          </div>

          {/* Read-only attribute pills — aligned at 50% */}
          {displayAttributes && displayAttributes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 w-1/2">
              {displayAttributes.map((attr) => {
                const max = gear.attributeMaxValues?.[attr];
                return (
                  <span
                    key={attr}
                    className="text-[11px] font-semibold w-full"
                    style={{ color: rarityColor }}
                  >
                    + {attr}{max !== undefined ? ` (${max}%)` : ''}
                  </span>
                );
              })}
            </div>
          )}

          <div className="ml-auto shrink-0">
            {selected && !disabled && (
              <span className="text-blue-400 text-lg font-bold">✓</span>
            )}
            {disabled && (
              <span className="text-gray-500 dark:text-gray-600 text-xs font-semibold whitespace-nowrap">🔒 Cap reached</span>
            )}
          </div>
        </div>

        {/* Inline attribute selector — only when selected */}
        {showAttributes && (
          <div
            className="border-t border-blue-200 dark:border-blue-900 mt-3 pt-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[11px] text-gray-500 uppercase tracking-widest block mb-2">Attributes</span>
            <div className="flex flex-col gap-2">
              {attrLabels.map((label, i) => (
                <div key={i}>
                  <div className="text-[11px] text-gray-500 mb-1">{label}</div>
                  <select
                    value={selectedAttributes?.[i] ?? ''}
                    onChange={(e) => onAttributeChange!(i as 0 | 1 | 2, e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 text-xs px-2 py-1.5 w-full outline-none cursor-pointer"
                  >
                    <option value="">— Select —</option>
                    {attrOptions[i].map((opt) => {
                      const max = gear.attributeMaxValues?.[opt];
                      return (
                        <option key={opt} value={opt}>
                          {opt}{max !== undefined ? ` (${max}%)` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
