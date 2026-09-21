import { type LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: string;
  onAction?: () => void;
};

export default function EmptyState({ icon: Icon, title, message, action, onAction }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon"><Icon size={32} strokeWidth={1.3} /></div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <button className="outline-button" onClick={onAction}>{action}</button>}
    </div>
  );
}
