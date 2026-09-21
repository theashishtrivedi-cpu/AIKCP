import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, ChevronRight, Menu, Search, Sparkles, X } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e4db] bg-[#fbfaf7]/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Sanatan Board India home">
          <div className="brand-mark"><Sparkles size={23} strokeWidth={1.6} /></div>
          <div><div className="brand-name">Sanatan Board India</div><div className="brand-tag">Know · Discuss · Preserve · Build</div></div>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link className={`nav-link ${isActive(item) ? 'active' : ''}`} to={getHref(item)} key={item}>
              {item}{item === 'Explore' && <ChevronDown size={13} />}
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
          <Link to="/notifications" className="icon-button relative" aria-label="Notifications"><Bell size={18} /><span className="notification-dot">3</span></Link>
          <Link to="/profile" className="profile-button"><span className="avatar avatar-large">A</span><span className="hidden text-left xl:block"><span className="profile-greeting">Namaste</span><span className="profile-name">Arjun</span></span><ChevronDown size={15} /></Link>
        </div>
        <button className="icon-button md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
      {menuOpen && (
        <div className="mobile-menu md:hidden">
          <nav>
            {navItems.map((item) => (
              <Link to={getHref(item)} onClick={() => setMenuOpen(false)} key={item}>{item}<ChevronRight size={15} /></Link>
            ))}
          </nav>
          <div className="mobile-menu-foot">
            <div className="search-wrap-mini" style={{ flex: 1 }}>
              <Search size={16} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search..." />
            </div>
            <Link to="/notifications" className="icon-button" onClick={() => setMenuOpen(false)}><Bell size={18} /></Link>
            <Link to="/profile" className="icon-button" onClick={() => setMenuOpen(false)}><span className="avatar">A</span></Link>
          </div>
        </div>
      )}
    </header>
  );
}
