import { Link } from 'react-router-dom';
import { Sparkles, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="brand-mark"><Sparkles size={23} strokeWidth={1.6} /></div>
            <div><div className="brand-name">Sanatan Board India</div><div className="brand-tag">Know · Discuss · Preserve · Build</div></div>
          </Link>
          <p>A better tomorrow, built<br />on shared knowledge.</p>
        </div>
        <div className="footer-links">
          {['About', 'Guidelines', 'Privacy', 'Terms', 'Contact'].map((link) => <a href="#" key={link}>{link}</a>)}
        </div>
        <div className="social-links">
          <button aria-label="YouTube"><Send size={15} /></button>
          <button aria-label="X">X</button>
          <button aria-label="LinkedIn">in</button>
          <button aria-label="Instagram">◎</button>
        </div>
        <div className="footer-motto">Bharat for a Better Tomorrow <span>🇮🇳</span></div>
      </div>
    </footer>
  );
}
