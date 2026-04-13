import type { TaskStats, FilterStatus } from '../types';

interface Props {
  stats: TaskStats;
  activeFilter: FilterStatus;
  onFilter: (filter: FilterStatus) => void;
}

const STAT_ITEMS = [
  { key: 'all' as FilterStatus, label: 'Total', valueKey: 'total', color: 'text-slate-700', accent: 'bg-slate-700', border: 'border-slate-300', activeBg: 'bg-slate-700', ring: 'ring-slate-300' },
  { key: 'pending' as FilterStatus, label: 'Pending', valueKey: 'pending', color: 'text-amber-600', accent: 'bg-amber-400', border: 'border-amber-200', activeBg: 'bg-amber-500', ring: 'ring-amber-300' },
  { key: 'in_progress' as FilterStatus, label: 'In Progress', valueKey: 'in_progress', color: 'text-blue-600', accent: 'bg-blue-500', border: 'border-blue-200', activeBg: 'bg-blue-500', ring: 'ring-blue-300' },
  { key: 'completed' as FilterStatus, label: 'Completed', valueKey: 'completed', color: 'text-emerald-600', accent: 'bg-emerald-500', border: 'border-emerald-200', activeBg: 'bg-emerald-500', ring: 'ring-emerald-300' },
] as const;

export default function StatsBar({ stats, activeFilter, onFilter }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STAT_ITEMS.map((item) => {
        const value = item.valueKey === 'total' ? stats.total : stats[item.valueKey as keyof typeof stats];
        const isActive = activeFilter === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onFilter(item.key)}
            className={`group text-left rounded-2xl border p-4 transition-all duration-200
              ${isActive
                ? `${item.border} bg-white shadow-md ring-2 ${item.ring}`
                : 'border-slate-200 bg-white hover:shadow-sm hover:border-slate-300'
              }`}
          >
            <div className={`text-2xl font-bold tabular-nums ${item.color}`}>
              {value}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${item.accent}`} />
              <span className="text-xs font-medium text-slate-500">{item.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
