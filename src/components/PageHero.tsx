import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

type Crumb = { label: string; to?: string };

export default function PageHero({ eyebrow, title, description, crumbs, image }: {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  image?: string;
}) {
  return (
    <section className="page-hero" style={image ? { backgroundImage: `linear-gradient(90deg, rgba(18, 24, 27, .82), rgba(32, 34, 27, .5)), url(${image})` } : undefined}>
      <div className="page-hero-inner">
        {crumbs && (
          <nav className="breadcrumb">
            {crumbs.map((crumb, i) => (
              <span key={i} className="breadcrumb-item">
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                {i < crumbs.length - 1 && <ChevronRight size={12} />}
              </span>
            ))}
          </nav>
        )}
        <div className={`eyebrow ${image ? 'light' : ''}`}><span />{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  );
}
