import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ThumbsUp, ThumbsDown, MessageCircle, Clock3, Bookmark, Share2 } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import AssistantPanel from '@/components/AssistantPanel';
import { SubcategoryBadge } from '@/components/Badges';
import { articles, questions } from '@/data/mockData';

export default function ArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return (
      <main>
        <PageHero eyebrow="Articles" title="Article not found" description="This article may have been removed or is not yet available." crumbs={[{ label: 'Home', to: '/' }, { label: 'Questions', to: '/questions' }, { label: 'Not found' }]} />
      </main>
    );
  }

  const relatedQuestions = questions.filter((q) => q.categoryId === article.categoryId).slice(0, 4);

  return (
    <main>
      <PageHero
        eyebrow="Answer · Article"
        title={article.title}
        description={article.excerpt}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Questions', to: '/questions' }, { label: article.category, to: `/categories/${article.categoryId}` }, { label: article.subcategory, to: `/categories/${article.categoryId}/${article.subcategoryId}` }]}
        image={article.id === 'a1' ? 'https://images.pexels.com/photos/28868115/pexels-photo-28868115.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' : 'https://images.pexels.com/photos/13044308/pexels-photo-13044308.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'}
      />
      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="article-layout">
          <article className="article-main">
            <div className="article-meta-bar">
              <span className="avatar" style={{ backgroundColor: article.authorColor }}>{article.authorInitial}</span>
              <div className="article-author-info">
                <strong>{article.author}</strong>
                <span>{article.publishedAt} · {article.readTime}</span>
              </div>
              <SubcategoryBadge category={article.category} categoryId={article.categoryId} subcategory={article.subcategory} subcategoryId={article.subcategoryId} />
            </div>
            <div className="article-question-ref">
              <span className="eyebrow"><span />Answering</span>
              <Link to={`/questions/${article.questionId}`}>{article.question} <ChevronRight size={13} /></Link>
            </div>
            <div className="article-content">
              {article.content.map((para, i) => <p key={i}>{para}</p>)}
            </div>
            <div className="article-actions">
              <button className="article-action-btn like"><ThumbsUp size={16} /> {article.likes}</button>
              <button className="article-action-btn"><ThumbsDown size={16} /> {article.dislikes}</button>
              <button className="article-action-btn"><Bookmark size={16} /> Save</button>
              <button className="article-action-btn"><Share2 size={16} /> Share</button>
            </div>
            <SectionHeading eyebrow="Reader discussion" title="Comments" />
            <div className="comment-section">
              <div className="comment-input">
                <span className="avatar" style={{ backgroundColor: '#cf7847' }}>A</span>
                <input placeholder="Share your thoughts..." />
                <button>Post</button>
              </div>
              <div className="comment-list">
                {article.comments.map((comment) => (
                  <div key={comment.id}>
                    <div className="comment-item">
                      <span className="avatar" style={{ backgroundColor: comment.authorColor }}>{comment.authorInitial}</span>
                      <div className="comment-body">
                        <div className="comment-meta"><strong>{comment.author}</strong> · {comment.time}</div>
                        <p>{comment.text}</p>
                        <div className="comment-actions"><button>Reply</button><button>Like</button></div>
                      </div>
                    </div>
                    {comment.replies?.map((reply) => (
                      <div className="comment-item reply" key={reply.id}>
                        <span className="avatar" style={{ backgroundColor: reply.authorColor }}>{reply.authorInitial}</span>
                        <div className="comment-body">
                          <div className="comment-meta"><strong>{reply.author}</strong> · {reply.time}</div>
                          <p>{reply.text}</p>
                          <div className="comment-actions"><button>Reply</button><button>Like</button></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </article>
          <aside className="article-rail">
            <AssistantPanel />
            <div className="rail-section">
              <SectionHeading eyebrow="Continue reading" title="Related Questions" />
              <div className="question-list">
                {relatedQuestions.map((q) => (
                  <Link to={`/questions/${q.id}`} className="question-row" key={q.id}>
                    <span className="avatar" style={{ backgroundColor: q.avatarColor }}>{q.avatarInitial}</span>
                    <div className="question-body">
                      <strong>{q.question}</strong>
                      <div className="question-meta"><span><MessageCircle size={13} /> {q.answers}</span><span><Clock3 size={13} /> {q.time}</span></div>
                    </div>
                    <ChevronRight className="row-arrow" size={16} />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
