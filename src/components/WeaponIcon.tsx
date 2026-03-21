import type { ReactElement } from 'react';
import type { MeleeWeaponType, RangedWeaponType, GearCategory } from '../types';

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

// Hankyu (short bow) — compact D-shaped bow, arc curves toward target (right)
export function HankyuIcon({ size = 24, color = 'currentColor' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Bow stave — symmetric D-curve, tips at left, belly curves right */}
      <path d="M6 3 C17 3 17 21 6 21" stroke={color} strokeWidth="2" fill="none" />
      {/* Bowstring — taut chord connecting the two tips */}
      <line x1="6" y1="3" x2="6" y2="21" stroke={color} strokeWidth="1" opacity="0.65" />
      {/* Arrow shaft — nocked at string centre, points right */}
      <line x1="6" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.5" />
      {/* Arrowhead */}
      <path d="M18 10.5 L22 12 L18 13.5 Z" fill={color} stroke="none" />
      {/* Fletching — feathers angle back from the nock */}
      <line x1="8.5" y1="12" x2="5.5" y2="9.5" stroke={color} strokeWidth="1.2" />
      <line x1="8.5" y1="12" x2="5.5" y2="14.5" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

// Tanegashima (matchlock rifle) — gun with stock and barrel
export function TanegashimaIcon({ size = 24, color = 'currentColor' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Barrel */}
      <line x1="6" y1="9" x2="22" y2="9" stroke={color} strokeWidth="2" />
      {/* Stock body */}
      <path d="M6 9 L4 9 L2 14 L7 13 L8 9" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" />
      {/* Trigger guard */}
      <path d="M11 9 Q12 12 13 9" stroke={color} strokeWidth="1.2" fill="none" />
      {/* Lock mechanism */}
      <rect x="14" y="7" width="4" height="4" rx="0.5" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.2" />
      {/* Muzzle end */}
      <line x1="22" y1="8" x2="22" y2="10" stroke={color} strokeWidth="2" />
    </svg>
  );
}

// Yumi (longbow) — tall Japanese longbow; full-height stave, arrow nocked below centre
export function YumiIcon({ size = 24, color = 'currentColor' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Bow stave — slender arc, tips at top & bottom edges */}
      <path d="M7 2 C15 2 15 22 7 22" stroke={color} strokeWidth="2" fill="none" />
      {/* Bowstring — taut chord */}
      <line x1="7" y1="2" x2="7" y2="22" stroke={color} strokeWidth="1" opacity="0.65" />
      {/* Grip mark — yumi is gripped below centre (≈ ⅓ from bottom) */}
      <line x1="5.5" y1="15.5" x2="8.5" y2="15.5" stroke={color} strokeWidth="1.8" opacity="0.6" strokeLinecap="butt" />
      {/* Arrow shaft — nocked slightly below string centre (authentic yumi draw) */}
      <line x1="7" y1="13" x2="20" y2="13" stroke={color} strokeWidth="1.5" />
      {/* Arrowhead */}
      <path d="M19 11.5 L23 13 L19 14.5 Z" fill={color} stroke="none" />
      {/* Fletching */}
      <line x1="9.5" y1="13" x2="6.5" y2="10.5" stroke={color} strokeWidth="1.2" />
      <line x1="9.5" y1="13" x2="6.5" y2="15.5" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

// Bomb — round grenade with fuse spark
export function BombIcon({ size = 24, color = 'currentColor' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Bomb body */}
      <circle cx="12" cy="15" r="7" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" />
      {/* Fuse */}
      <path d="M16 8 Q19 5 18 2" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Spark */}
      <line x1="16" y1="2" x2="18" y2="2" stroke={color} strokeWidth="1.5" />
      <line x1="17" y1="1" x2="17" y2="3" stroke={color} strokeWidth="1.5" />
      {/* Shine */}
      <circle cx="9" cy="12" r="1.5" fill={color} fillOpacity="0.35" stroke="none" />
    </svg>
  );
}

// Charm — magatama (Japanese comma jewel) + loop
export function CharmIcon({ size = 24, color = 'currentColor' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* String loop */}
      <path d="M10 4 Q12 2 14 4" stroke={color} strokeWidth="1.2" fill="none" />
      {/* Crystal / gem body */}
      <path d="M8 5 L12 4 L16 5 L18 10 L12 20 L6 10 Z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" />
      {/* Facet line */}
      <line x1="8" y1="5" x2="16" y2="5" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="6" y1="10" x2="18" y2="10" stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

// Ghost Tool — kunai throwing blade
export function GhostToolIcon({ size = 24, color = 'currentColor' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Blade */}
      <path d="M12 2 L15 11 L12 13 L9 11 Z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.2" />
      {/* Handle wrapping */}
      <line x1="10.5" y1="13" x2="13.5" y2="13" stroke={color} strokeWidth="2" />
      <line x1="10.5" y1="15.5" x2="13.5" y2="15.5" stroke={color} strokeWidth="2" />
      <line x1="10.5" y1="18" x2="13.5" y2="18" stroke={color} strokeWidth="2" />
      {/* Ring */}
      <circle cx="12" cy="21" r="1.8" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// ─── Maps ────────────────────────────────────────────────────────────────────

const MELEE_ICONS: Record<MeleeWeaponType, (props: WeaponIconProps) => ReactElement> = {
  katana:       KatanaIcon,
  dual_katana:  DualKatanaIcon,
  yari:         YariIcon,
  kusarigama:   KusarigamaIcon,
  odachi:       OdachiIcon,
};

const RANGED_ICONS: Record<RangedWeaponType, (props: WeaponIconProps) => ReactElement> = {
  hankyu:       HankyuIcon,
  tanegashima:  TanegashimaIcon,
  yumi:         YumiIcon,
  bomb:         BombIcon,
};

const CATEGORY_ICONS: Partial<Record<GearCategory, (props: WeaponIconProps) => ReactElement>> = {
  'Charm':      CharmIcon,
  'Ghost Tool': GhostToolIcon,
};

// ─── GearIcon ─────────────────────────────────────────────────────────────────

interface GearIconProps extends WeaponIconProps {
  weaponType?: MeleeWeaponType;
  rangedWeaponType?: RangedWeaponType;
  category?: GearCategory;
  fallback: string;
}

export default function GearIcon({
  weaponType,
  rangedWeaponType,
  category,
  fallback,
  size = 24,
  color = '#e5e7eb',
}: GearIconProps) {
  if (weaponType && MELEE_ICONS[weaponType]) {
    const Icon = MELEE_ICONS[weaponType];
    return <Icon size={size} color={color} />;
  }
  if (rangedWeaponType && RANGED_ICONS[rangedWeaponType]) {
    const Icon = RANGED_ICONS[rangedWeaponType];
    return <Icon size={size} color={color} />;
  }
  if (category && CATEGORY_ICONS[category]) {
    const Icon = CATEGORY_ICONS[category]!;
    return <Icon size={size} color={color} />;
  }
  return <span style={{ fontSize: size }}>{fallback}</span>;
}
