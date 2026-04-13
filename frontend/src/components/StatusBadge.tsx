import type { TaskStatus } from '../types';
import { STATUS_CONFIG } from '../utils';

interface Props {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const config = STATUS_CONFIG[status];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.color} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
