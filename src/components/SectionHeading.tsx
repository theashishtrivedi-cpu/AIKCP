import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type Props = {
  eyebrow: string;
  title: string;
  action?: string;
  actionTo?: string;
};

export default function SectionHeading({ eyebrow, title, action, actionTo }: Props) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow"><span />{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {action && (
        <Link to={actionTo || '#'} className="section-heading-action">
          {action} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
