import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  return (
    <Link to="/notifications" className="icon-button relative" aria-label="Notifications">
      <Bell size={18} />
      <span className="notification-dot">3</span>
    </Link>
  );
}
