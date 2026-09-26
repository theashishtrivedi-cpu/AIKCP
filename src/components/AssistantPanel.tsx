import { ChevronRight, Sparkles } from 'lucide-react';

export default function AssistantPanel() {
  const actions = ['Summarize this topic', 'Find related questions', 'Explain in simple terms', 'Translate content', 'Suggest what to read'];
  return (
    <aside className="assistant-panel">
      <div className="assistant-title">
        <span className="bot-icon"><Sparkles size={23} /></span>
        <div>
          <h2>AI Assistant <small>BETA</small></h2>
          <p>Ask, explore and get insights from our knowledge base.</p>
        </div>
      </div>
      <div className="assistant-actions">
        {actions.map((action) => <button key={action}>{action}<ChevronRight size={15} /></button>)}
      </div>
    </aside>
  );
}

export function AssistantInline() {
  const actions = ['Summarize this topic', 'Find related questions', 'Explain in simple terms', 'Translate content', 'Suggest what to read'];
  return (
    <div className="assistant-panel">
      <div className="assistant-title">
        <span className="bot-icon"><Sparkles size={23} /></span>
        <div>
          <h2>AI Assistant <small>BETA</small></h2>
          <p>Ask, explore and get insights from our knowledge base.</p>
        </div>
      </div>
      <div className="assistant-actions">
        {actions.map((action) => <button key={action}>{action}<ChevronRight size={15} /></button>)}
      </div>
    </div>
  );
}
