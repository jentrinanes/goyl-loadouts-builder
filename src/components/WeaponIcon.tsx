import type { ReactElement } from 'react';
import type { MeleeWeaponType } from '../types';

interface WeaponIconProps {
  size?: number;
  color?: string;
}

// Single katana — diagonal blade, guard, handle & pommel
export function KatanaIcon({ size = 24, color = 'currentColor' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Blade */}
      <line x1="20" y1="3" x2="8" y2="15" stroke={color} strokeWidth="1.5" />
      {/* Guard */}
      <line x1="6" y1="12" x2="10" y2="16" stroke={color} strokeWidth="2.5" />
      {/* Handle */}
      <line x1="8" y1="15" x2="4" y2="19" stroke={color} strokeWidth="2" />
      {/* Pommel */}
      <circle cx="3" cy="20.5" r="1.2" fill={color} />
    </svg>
  );
}

// Dual katana — two overlapping swords
export function DualKatanaIcon({ size = 24, color = 'currentColor' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Blade 1 */}
      <line x1="19" y1="2" x2="7" y2="14" stroke={color} strokeWidth="1.5" />
      <line x1="5" y1="11" x2="9" y2="15" stroke={color} strokeWidth="2.2" />
      <line x1="7" y1="14" x2="3" y2="18" stroke={color} strokeWidth="1.8" />
      {/* Blade 2 (offset) */}
      <line x1="22" y1="5" x2="13" y2="14" stroke={color} strokeWidth="1.5" opacity="0.55" />
      <line x1="11" y1="12" x2="14" y2="15" stroke={color} strokeWidth="2.2" opacity="0.55" />
      <line x1="13" y1="14" x2="10" y2="17" stroke={color} strokeWidth="1.8" opacity="0.55" />
    </svg>
  );
}

// Yari (spear) — long shaft with pointed tip
export function YariIcon({ size = 24, color = 'currentColor' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Shaft */}
      <line x1="4" y1="20" x2="17" y2="7" stroke={color} strokeWidth="1.8" />
      {/* Spear tip */}
      <path d="M17 7 L21 3 L19 8 Z" fill={color} stroke={color} strokeWidth="1" />
    </svg>
  );
}

// Kusarigama — sickle blade + chain
export function KusarigamaIcon({ size = 24, color = 'currentColor' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Sickle blade */}
      <path d="M5 19 C5 19 3 12 10 8 C14 6 17 7 17 7 C17 7 14 9 13 12 C12 14 13 16 13 16" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Handle */}
      <line x1="5" y1="19" x2="2" y2="22" stroke={color} strokeWidth="2" />
      {/* Chain */}
      <path d="M13 16 Q17 17 20 14" stroke={color} strokeWidth="1.2" strokeDasharray="1.5 1.5" fill="none" />
      <circle cx="20.5" cy="13.5" r="1.2" fill={color} />
    </svg>
  );
}

// Odachi — oversized two-handed sword, wider blade
export function OdachiIcon({ size = 24, color = 'currentColor' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Wide blade */}
      <path d="M21 2 L6 17 L8 19 L21 2Z" fill={color} opacity="0.25" stroke={color} strokeWidth="1" />
      {/* Spine */}
      <line x1="21" y1="2" x2="7" y2="16" stroke={color} strokeWidth="1.5" />
      {/* Guard */}
      <line x1="5" y1="13" x2="9" y2="17" stroke={color} strokeWidth="2.5" />
      {/* Handle */}
      <line x1="7" y1="16" x2="3" y2="20" stroke={color} strokeWidth="2" />
      {/* Pommel */}
      <circle cx="2.5" cy="21" r="1.2" fill={color} />
    </svg>
  );
}

// Map weaponType → icon component
const MELEE_ICONS: Record<MeleeWeaponType, (props: WeaponIconProps) => ReactElement> = {
  katana:       KatanaIcon,
  dual_katana:  DualKatanaIcon,
  yari:         YariIcon,
  kusarigama:   KusarigamaIcon,
  odachi:       OdachiIcon,
};

interface GearIconProps extends WeaponIconProps {
  weaponType?: MeleeWeaponType;
  fallback: string;
}

export default function GearIcon({ weaponType, fallback, size = 24, color = '#e5e7eb' }: GearIconProps) {
  if (weaponType && MELEE_ICONS[weaponType]) {
    const Icon = MELEE_ICONS[weaponType];
    return <Icon size={size} color={color} />;
  }
  return <span style={{ fontSize: size }}>{fallback}</span>;
}
