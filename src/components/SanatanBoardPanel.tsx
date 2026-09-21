import { Link } from 'react-router-dom';
import { ArrowRight, Landmark } from 'lucide-react';

export default function SanatanBoardPanel() {
  return (
    <div className="board-card" id="sanatan-board">
      <div className="board-icon"><Landmark size={32} strokeWidth={1.3} /></div>
      <div className="eyebrow">A distinct experience</div>
      <h2>Sanatan Board</h2>
      <p>Explore the complete Sanatan Board of India Act, documents, discussions and more.</p>
      <div className="language-row"><span>अ</span><span>अ</span><span>A</span><span>+</span></div>
      <Link to="/sanatan-board" className="outline-button">Open Sanatan Board <ArrowRight size={15} /></Link>
    </div>
  );
}
