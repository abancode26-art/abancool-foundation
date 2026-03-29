import { Check } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-success/10', text: 'text-success' },
  completed: { bg: 'bg-success/10', text: 'text-success' },
  confirmed: { bg: 'bg-success/10', text: 'text-success' },
  paid: { bg: 'bg-success/10', text: 'text-success' },
  answered: { bg: 'bg-info/10', text: 'text-info' },
  pending: { bg: 'bg-warning/10', text: 'text-warning' },
  unpaid: { bg: 'bg-warning/10', text: 'text-warning' },
  provisioning: { bg: 'bg-info/10', text: 'text-info' },
  processing: { bg: 'bg-info/10', text: 'text-info' },
  open: { bg: 'bg-info/10', text: 'text-info' },
  client_reply: { bg: 'bg-warning/10', text: 'text-warning' },
  suspended: { bg: 'bg-destructive/10', text: 'text-destructive' },
  cancelled: { bg: 'bg-muted', text: 'text-muted-foreground' },
  terminated: { bg: 'bg-muted', text: 'text-muted-foreground' },
  closed: { bg: 'bg-muted', text: 'text-muted-foreground' },
  failed: { bg: 'bg-destructive/10', text: 'text-destructive' },
  rejected: { bg: 'bg-destructive/10', text: 'text-destructive' },
  overdue: { bg: 'bg-destructive/10', text: 'text-destructive' },
  expired: { bg: 'bg-destructive/10', text: 'text-destructive' },
  draft: { bg: 'bg-muted', text: 'text-muted-foreground' },
  maintenance: { bg: 'bg-warning/10', text: 'text-warning' },
  offline: { bg: 'bg-destructive/10', text: 'text-destructive' },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: 'bg-muted', text: 'text-muted-foreground' };
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text} ${className}`}>
      {(status === 'active' || status === 'completed' || status === 'confirmed' || status === 'paid') && <Check className="h-3 w-3" />}
      {label}
    </span>
  );
}
