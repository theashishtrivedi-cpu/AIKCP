import { Link } from 'react-router-dom';
import { ChevronRight, MessageCircle, CircleHelp } from 'lucide-react';
import type { Question } from '@/data/mockData';

export default function QuestionCard({ question }: { question: Question }) {
  return (
    <Link to={`/questions/${question.id}`} className="question-row">
      <span className="avatar" style={{ backgroundColor: question.avatarColor }}>{question.avatarInitial}</span>
      <div className="question-body">
        <strong>{question.question}</strong>
        <div className="question-meta">
          <span><MessageCircle size={13} /> {question.answers} answers</span>
          <span><CircleHelp size={13} /> {question.comments} comments</span>
          <Link to={`/categories/${question.categoryId}`} className="category-pill" onClick={(e) => e.stopPropagation()}>{question.category}</Link>
        </div>
      </div>
      <time>{question.time}</time>
      <ChevronRight className="row-arrow" size={16} />
    </Link>
  );
}

export function QuestionList({ questions }: { questions: Question[] }) {
  return (
    <div className="question-list">
      {questions.map((q) => <QuestionCard question={q} key={q.id} />)}
    </div>
  );
}
