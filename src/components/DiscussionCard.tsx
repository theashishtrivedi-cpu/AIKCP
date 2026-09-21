import { Link } from 'react-router-dom';
import { ChevronRight, MessageCircle, CircleHelp } from 'lucide-react';
import type { Discussion } from '@/data/mockData';

export default function DiscussionCard({ discussion }: { discussion: Discussion }) {
  return (
    <Link to={`/questions/${discussion.id}`} className="discussion-card-link">
      <article className="discussion-card">
        <div className="discussion-image">
          <img src={discussion.image} alt="" />
          <span className={`discussion-badge ${discussion.badgeTone}`}>{discussion.badge}</span>
        </div>
        <div className="discussion-content">
          <h3>{discussion.title}</h3>
          <div className="discussion-stats">
            <span><MessageCircle size={14} /> {discussion.answers} answers</span>
            <span><CircleHelp size={14} /> {discussion.comments} comments</span>
          </div>
          <div className="tag-row">
            <Link to={`/categories/${discussion.categoryId}`}>{discussion.category}</Link>
            <Link to={`/categories/${discussion.categoryId}/${discussion.subcategoryId}`}>{discussion.subcategory}</Link>
          </div>
          <div className="discussion-footer">
            <div className="participant-stack">
              {discussion.participants.map((color, index) => (
                <span className="avatar mini" style={{ backgroundColor: color }} key={color}>
                  {['A', 'R', 'S'][index]}
                </span>
              ))}
            </div>
            <span className="active-status"><i /> Active discussion</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
