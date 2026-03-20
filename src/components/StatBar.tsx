import type { StatKey } from '../types';

interface StatMeta {
  label: string;
  barClass: string;
}

const STAT_META: Record<StatKey, StatMeta> = {
  attack:  { label: 'Attack',  barClass: 'bg-red-500'    },
  defense: { label: 'Defense', barClass: 'bg-blue-500'   },
  health:  { label: 'Health',  barClass: 'bg-green-500'  },
  resolve: { label: 'Resolve', barClass: 'bg-amber-400'  },
  stealth: { label: 'Stealth', barClass: 'bg-violet-500' },
  ranged:  { label: 'Ranged',  barClass: 'bg-cyan-500'   },
};

interface StatBarProps {
  stat: StatKey;
  value: number;
  compact?: boolean;
}

export default function StatBar({ stat, value, compact = false }: StatBarProps) {
  const meta = STAT_META[stat];
  if (!meta) return null;

  return (
    <div className={compact ? 'mb-1' : 'mb-2'}>
      <div className="flex justify-between mb-0.5">
        <span className={`${compact ? 'text-[11px]' : 'text-xs'} text-gray-400 uppercase tracking-widest`}>
          {meta.label}
        </span>
        <span className={`${compact ? 'text-[11px]' : 'text-xs'} text-gray-200 font-semibold`}>
          {value}
        </span>
      </div>
      <div className={`bg-gray-800 rounded overflow-hidden ${compact ? 'h-1' : 'h-1.5'}`}>
        <div
          className={`h-full rounded transition-[width] duration-[400ms] ease-in-out ${meta.barClass}`}
          style={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
