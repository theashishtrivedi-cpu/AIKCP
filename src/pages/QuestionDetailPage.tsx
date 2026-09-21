import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, MessageCircle, CircleHelp, Clock3, Users } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import AssistantPanel from '@/components/AssistantPanel';
import QuestionCard from '@/components/QuestionCard';
import { SubcategoryBadge } from '@/components/Badges';
import { discussions, questions, articles, getRelatedQuestions } from '@/data/mockData';

export default function QuestionDetailPage() {
  const { questionId } = useParams<{ questionId: string }>();

  const discussion = discussions.find((d) => d.id === questionId);
  const question = questions.find((q) => q.id === questionId);

  const data = discussion || question;
  if (!data) {
    return (
      <main>
        <PageHero eyebrow="Questions" title="Question not found" description="This question may have been removed or is not yet available." crumbs={[{ label: 'Home', to: '/' }, { label: 'Questions', to: '/questions' }, { label: 'Not found' }]} />
      </main>
    );
  }

  const title = 'question' in data ? data.question : (data as typeof discussions[0]).title;
  const categoryId = 'categoryId' in data ? data.categoryId : (data as typeof discussions[0]).categoryId;
  const category = 'category' in data ? data.category : (data as typeof discussions[0]).category;
  const subcategory = 'subcategory' in data ? data.subcategory : (data as typeof discussions[0]).subcategory;
  const subcategoryId = 'subcategoryId' in data ? data.subcategoryId : (data as typeof discussions[0]).subcategoryId;
  const answersCount = 'answers' in data ? data.answers : (data as typeof discussions[0]).answers;
  const commentsCount = 'comments' in data ? data.comments : (data as typeof discussions[0]).comments;

  const related = getRelatedQuestions(questionId || '', categoryId);
  const articleList = articles.filter((a) => a.questionId === questionId || a.categoryId === categoryId);

  return (
    <main>
      <PageHero
        eyebrow="Question & Discussion"
        title={title}
        description="An admin-created topic for community answers, articles and discussion."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Questions', to: '/questions' }, { label: category, to: `/categories/${categoryId}` }, { label: subcategory, to: `/categories/${categoryId}/${subcategoryId}` }]}
      />
      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="detail-layout">
          <div className="detail-main">
            <SubcategoryBadge category={category} categoryId={categoryId} subcategory={subcategory} subcategoryId={subcategoryId} />
            <div className="detail-stats-row">
              <span><MessageCircle size={14} /> {answersCount} answers</span>
              <span><CircleHelp size={14} /> {commentsCount} comments</span>
              <span><Users size={14} /> 312 participants</span>
              <span><Clock3 size={14} /> Active 2 hours ago</span>
            </div>
            <div className="detail-description">
              <p>This question explores a key aspect of {subcategory} within {category}. The community has contributed multiple answers and articles addressing this topic from various perspectives \u2014 historical, philosophical, and practical.</p>
              <p>Join the discussion by sharing your own answer or by engaging with the existing responses below. The AI Assistant can help you summarize, translate, or find related content.</p>
            </div>

            <SectionHeading eyebrow="Community responses" title="Answers & Articles" action="Write an answer" actionTo="/profile" />
            <div className="answer-list">
              {articleList.length > 0 ? articleList.map((article) => (
                <Link to={`/articles/${article.id}`} className="answer-preview" key={article.id}>
                  <div className="answer-preview-head">
                    <span className="avatar" style={{ backgroundColor: article.authorColor }}>{article.authorInitial}</span>
                    <div>
                      <strong>{article.title}</strong>
                      <span className="answer-author">by {article.author} · {article.readTime} · {article.likes} likes</span>
                    </div>
                  </div>
                  <p>{article.excerpt}</p>
                  <span className="answer-read-more">Read article <ArrowRight size={13} /></span>
                </Link>
              )) : (
                <div className="answer-preview">
                  <p>No answers yet. Be the first to answer this question.</p>
                </div>
              )}
            </div>

            <SectionHeading eyebrow="Join the discussion" title="Comments" />
            <div className="comment-section">
              <div className="comment-input">
                <span className="avatar" style={{ backgroundColor: '#cf7847' }}>A</span>
                <input placeholder="Share your thoughts..." />
                <button>Post</button>
              </div>
              <div className="comment-list">
                <div className="comment-item">
                  <span className="avatar" style={{ backgroundColor: '#78a77b' }}>S</span>
                  <div className="comment-body">
                    <div className="comment-meta"><strong>Sneha Iyer</strong> · 2 days ago</div>
                    <p>This is a thoughtful question. I think we need to consider both the historical context and the practical implications for today.</p>
                    <div className="comment-actions"><button>Reply</button><button>Like (8)</button></div>
                  </div>
                </div>
                <div className="comment-item reply">
                  <span className="avatar" style={{ backgroundColor: '#d78b43' }}>R</span>
                  <div className="comment-body">
                    <div className="comment-meta"><strong>Dr. Rajesh Kumar</strong> · 2 days ago</div>
                    <p>Well said, Sneha. The historical context is essential \u2014 without it we risk misinterpreting the practices.</p>
                    <div className="comment-actions"><button>Reply</button><button>Like (3)</button></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <aside className="detail-rail">
            <AssistantPanel />
            <div className="rail-section">
              <SectionHeading eyebrow="Explore further" title="Related Questions" />
              <div className="question-list">
                {related.map((q) => <QuestionCard question={q} key={q.id} />)}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
