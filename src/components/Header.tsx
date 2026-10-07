import { useState } from 'react';
import { useUnreadNotificationCount } from '@/hooks/useUnreadNotificationCount';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = ['Home', 'Questions', 'Current Affairs', 'Sanatan Board', 'Explore'];

function getHref(item: string) {
  const map: Record<string, string> = {
    Home: '/',
    Questions: '/questions',
    'Current Affairs': '/current-affairs',
    'Sanatan Board': '/sanatan-board',
    Explore: '/search',
  };

  return map[item];
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loading, signOut } = useAuth();
  const { count: unreadNotificationCount, error: notificationCountError } = useUnreadNotificationCount();

  const isActive = (item: string) => {
    const href = getHref(item);

    if (href === '/') return location.pathname === '/';

    return location.pathname.startsWith(href);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const displayName =
    profile?.display_name ||
    user?.email?.split('@')[0] ||
    'Guest';

  const avatarInitial =
    displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e4db] bg-[#fbfaf7]/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-10">

        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label="Sanatan Board India home"
        >
          <div className="brand-mark">
            <Sparkles size={23} strokeWidth={1.6} />
          </div>

          <div>
            <div className="brand-name">Sanatan Board India</div>
            <div className="brand-tag">
              Know · Discuss · Preserve · Build
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              className={`nav-link ${isActive(item) ? 'active' : ''}`}
              to={getHref(item)}
              key={item}
            >
              {item}
              {item === 'Explore' && <ChevronDown size={13} />}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div className="search-wrap-mini">
            <Search size={16} />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search..."
              aria-label="Search"
            />
          </div>

          <Link
            to="/notifications"
            className="icon-button relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {!notificationCountError && unreadNotificationCount > 0 && (
              <span className="notification-dot" aria-label={`${unreadNotificationCount} unread notifications`}>{unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}</span>
            )}
          </Link>

          <Link to="/profile" className="profile-button">
            <span className="avatar avatar-large">
              {loading ? '…' : avatarInitial}
            </span>

            <span className="hidden text-left xl:block">
              <span className="profile-greeting">
                {user ? 'Namaste' : 'Welcome'}
              </span>

              <span className="profile-name">
                {loading ? 'Loading...' : displayName}
              </span>
            </span>

            <ChevronDown size={15} />
          </Link>

          {user && (
            <button
              type="button"
              className="icon-button"
              onClick={handleSignOut}
              title="Sign out"
              aria-label="Sign out"
            >
              <span className="text-xs font-medium">Exit</span>
            </button>
          )}
        </div>

        <button
          className="icon-button md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu md:hidden">
          <nav>
            {navItems.map((item) => (
              <Link
                to={getHref(item)}
                onClick={() => setMenuOpen(false)}
                key={item}
              >
                {item}
                <ChevronRight size={15} />
              </Link>
            ))}
          </nav>

          <div className="mobile-menu-foot">
            <div
              className="search-wrap-mini"
              style={{ flex: 1 }}
            >
              <Search size={16} />

              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleSearch()
                }
                placeholder="Search..."
              />
            </div>

            <Link
              to="/notifications"
              className="icon-button relative"
              onClick={() => setMenuOpen(false)}
              aria-label={
                unreadNotificationCount > 0
                  ? `Notifications, ${unreadNotificationCount} unread`
                  : 'Notifications'
              }
            >
              <Bell size={18} />
              {!notificationCountError && unreadNotificationCount > 0 && (
                <span className="notification-dot">
                  {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className="icon-button"
              onClick={() => setMenuOpen(false)}
            >
              <span className="avatar">
                {loading ? '…' : avatarInitial}
              </span>
            </Link>

            {user && (
              <button
                type="button"
                className="icon-button"
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                <span className="text-xs">Exit</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

