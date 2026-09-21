import {
  BookOpen,
  Brain,
  Landmark,
  Leaf,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';

export const heroImage = 'https://images.pexels.com/photos/28868115/pexels-photo-28868115.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const meditationImage = 'https://images.pexels.com/photos/13044308/pexels-photo-13044308.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const manuscriptImage = 'https://images.pexels.com/photos/37994572/pexels-photo-37994572.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const hampiImage = 'https://images.pexels.com/photos/5054128/pexels-photo-5054128.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const sunriseImage = 'https://images.pexels.com/photos/1721637/pexels-photo-1721637.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const templeImage2 = 'https://images.pexels.com/photos/37809040/pexels-photo-37809040.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const hampiImage2 = 'https://images.pexels.com/photos/29849403/pexels-photo-29849403.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export const discussionImages = [heroImage, meditationImage, manuscriptImage];

export type Topic = {
  id: string;
  name: string;
  description: string;
  count: string;
  icon: LucideIcon;
  tone: string;
  subcategories: { id: string; name: string; count: string }[];
};

export type Discussion = {
  id: string;
  badge: string;
  badgeTone: string;
  image: string;
  title: string;
  answers: number;
  comments: number;
  category: string;
  categoryId: string;
  subcategory: string;
  subcategoryId: string;
  participants: string[];
};

export type Question = {
  id: string;
  question: string;
  answers: number;
  comments: number;
  category: string;
  categoryId: string;
  subcategory: string;
  subcategoryId: string;
  time: string;
  avatarColor: string;
  avatarInitial: string;
  author: string;
};

export type NewsItem = {
  id: string;
  headline: string;
  source: string;
  time: string;
  summary: string;
  image: string;
  category: string;
};

export type TrendingTopic = [string, string];

export type Article = {
  id: string;
  questionId: string;
  question: string;
  title: string;
  author: string;
  authorInitial: string;
  authorColor: string;
  category: string;
  categoryId: string;
  subcategory: string;
  subcategoryId: string;
  excerpt: string;
  content: string[];
  likes: number;
  dislikes: number;
  comments: Comment[];
  readTime: string;
  publishedAt: string;
};

export type Comment = {
  id: string;
  author: string;
  authorInitial: string;
  authorColor: string;
  text: string;
  time: string;
  replies?: Comment[];
};

export type BoardSection = {
  id: string;
  title: string;
  description: string;
  articles: number;
};

export const topics: Topic[] = [
  {
    id: 'sanatan-dharma',
    name: 'Sanatan Dharma',
    description: 'Spirituality · Practices · Philosophy',
    count: '124 discussions',
    icon: Sparkles,
    tone: 'saffron',
    subcategories: [
      { id: 'vedanta', name: 'Vedanta', count: '32 discussions' },
      { id: 'karma', name: 'Karma & Dharma', count: '28 discussions' },
      { id: 'practices', name: 'Daily Practices', count: '24 discussions' },
      { id: 'deities', name: 'Deities & Worship', count: '40 discussions' },
    ],
  },
  {
    id: 'history-heritage',
    name: 'History & Heritage',
    description: 'Temples · Civilization · Freedom Struggle',
    count: '98 discussions',
    icon: Landmark,
    tone: 'ochre',
    subcategories: [
      { id: 'temple-heritage', name: 'Temple Heritage', count: '30 discussions' },
      { id: 'civilization', name: 'Ancient Civilization', count: '26 discussions' },
      { id: 'freedom-struggle', name: 'Freedom Struggle', count: '22 discussions' },
      { id: 'kingdoms', name: 'Kingdoms & Dynasties', count: '20 discussions' },
    ],
  },
  {
    id: 'culture-traditions',
    name: 'Culture & Traditions',
    description: 'Festivals · Arts · Literature',
    count: '76 discussions',
    icon: Leaf,
    tone: 'coral',
    subcategories: [
      { id: 'festivals', name: 'Festivals', count: '28 discussions' },
      { id: 'arts', name: 'Classical Arts', count: '22 discussions' },
      { id: 'literature', name: 'Literature', count: '16 discussions' },
      { id: 'cuisine', name: 'Cuisine & Cuisine', count: '10 discussions' },
    ],
  },
  {
    id: 'scriptures-philosophy',
    name: 'Scriptures & Philosophy',
    description: 'Vedas · Upanishads · Gita',
    count: '112 discussions',
    icon: BookOpen,
    tone: 'green',
    subcategories: [
      { id: 'bhagavad-gita', name: 'Bhagavad Gita', count: '38 discussions' },
      { id: 'upanishads', name: 'Upanishads', count: '30 discussions' },
      { id: 'vedas', name: 'Vedas', count: '24 discussions' },
      { id: 'darshanas', name: 'Darshanas', count: '20 discussions' },
    ],
  },
  {
    id: 'society-governance',
    name: 'Society & Governance',
    description: 'Education · Law · Policy',
    count: '64 discussions',
    icon: Users,
    tone: 'blue',
    subcategories: [
      { id: 'education', name: 'Education Policy', count: '22 discussions' },
      { id: 'law', name: 'Law & Justice', count: '18 discussions' },
      { id: 'governance', name: 'Governance', count: '14 discussions' },
      { id: 'citizenship', name: 'Citizenship', count: '10 discussions' },
    ],
  },
  {
    id: 'science-knowledge',
    name: 'Science & Knowledge',
    description: 'Ancient Knowledge · Modern Science',
    count: '49 discussions',
    icon: Brain,
    tone: 'indigo',
    subcategories: [
      { id: 'ancient-science', name: 'Ancient Indian Science', count: '18 discussions' },
      { id: 'ayurveda', name: 'Ayurveda', count: '14 discussions' },
      { id: 'astronomy', name: 'Astronomy', count: '10 discussions' },
      { id: 'modern-science', name: 'Modern Science', count: '7 discussions' },
    ],
  },
  {
    id: 'life-values',
    name: 'Life & Values',
    description: 'Wellbeing · Mindset · Youth',
    count: '58 discussions',
    icon: Leaf,
    tone: 'mint',
    subcategories: [
      { id: 'wellbeing', name: 'Wellbeing', count: '20 discussions' },
      { id: 'mindset', name: 'Mindset', count: '16 discussions' },
      { id: 'youth', name: 'Youth & Values', count: '12 discussions' },
      { id: 'ethics', name: 'Ethics', count: '10 discussions' },
    ],
  },
];

export const discussions: Discussion[] = [
  { id: 'q1', badge: 'Featured', badgeTone: 'gold', image: discussionImages[0], title: "How can we preserve India's temple heritage for future generations?", answers: 142, comments: 56, category: 'History & Heritage', categoryId: 'history-heritage', subcategory: 'Temple Heritage', subcategoryId: 'temple-heritage', participants: ['#d78b43', '#5a7b62', '#bc4f2c'] },
  { id: 'q2', badge: 'Trending', badgeTone: 'red', image: discussionImages[1], title: 'What is the relevance of Bhagavad Gita in modern life?', answers: 186, comments: 73, category: 'Scriptures & Philosophy', categoryId: 'scriptures-philosophy', subcategory: 'Bhagavad Gita', subcategoryId: 'bhagavad-gita', participants: ['#cb7144', '#3f6f65', '#d4a34d'] },
  { id: 'q3', badge: "Editor's Pick", badgeTone: 'blue', image: discussionImages[2], title: 'Can ancient Indian knowledge solve modern environmental crisis?', answers: 96, comments: 48, category: 'Science & Knowledge', categoryId: 'science-knowledge', subcategory: 'Ancient Indian Knowledge', subcategoryId: 'ancient-science', participants: ['#4e7c9f', '#d28352', '#65735d'] },
];

export const questions: Question[] = [
  { id: 'q4', question: 'How can we promote value-based education in modern schools?', answers: 18, comments: 12, category: 'Society & Governance', categoryId: 'society-governance', subcategory: 'Education Policy', subcategoryId: 'education', time: '2 hours ago', avatarColor: '#d78b43', avatarInitial: 'N', author: 'Neha Sharma' },
  { id: 'q5', question: 'What lessons can we learn from the life of Chhatrapati Shivaji Maharaj?', answers: 27, comments: 19, category: 'History & Heritage', categoryId: 'history-heritage', subcategory: 'Kingdoms & Dynasties', subcategoryId: 'kingdoms', time: '5 hours ago', avatarColor: '#e3803a', avatarInitial: 'R', author: 'Rahul Verma' },
  { id: 'q6', question: 'Is there a scientific basis for practices like Yoga and Meditation?', answers: 34, comments: 22, category: 'Science & Knowledge', categoryId: 'science-knowledge', subcategory: 'Ancient Indian Science', subcategoryId: 'ancient-science', time: '8 hours ago', avatarColor: '#78a77b', avatarInitial: 'S', author: 'Sneha Iyer' },
  { id: 'q7', question: 'How can we counter misinformation about Sanatan Dharma?', answers: 21, comments: 14, category: 'Sanatan Dharma', categoryId: 'sanatan-dharma', subcategory: 'Karma & Dharma', subcategoryId: 'karma', time: '1 day ago', avatarColor: '#d48c46', avatarInitial: 'K', author: 'Karthik Reddy' },
  { id: 'q8', question: 'What role can youth play in preserving our cultural heritage?', answers: 16, comments: 11, category: 'Life & Values', categoryId: 'life-values', subcategory: 'Youth & Values', subcategoryId: 'youth', time: '1 day ago', avatarColor: '#5f8ca2', avatarInitial: 'V', author: 'Vikram Singh' },
  { id: 'q9', question: 'What is the significance of the Vedas in contemporary society?', answers: 29, comments: 17, category: 'Scriptures & Philosophy', categoryId: 'scriptures-philosophy', subcategory: 'Vedas', subcategoryId: 'vedas', time: '2 days ago', avatarColor: '#bc7f23', avatarInitial: 'A', author: 'Ananya Gupta' },
  { id: 'q10', question: 'How did ancient Indian maritime trade influence global civilization?', answers: 12, comments: 8, category: 'History & Heritage', categoryId: 'history-heritage', subcategory: 'Ancient Civilization', subcategoryId: 'civilization', time: '2 days ago', avatarColor: '#4383bf', avatarInitial: 'P', author: 'Priya Nair' },
  { id: 'q11', question: 'What can we learn from the Gurukul system for modern education?', answers: 23, comments: 15, category: 'Society & Governance', categoryId: 'society-governance', subcategory: 'Education Policy', subcategoryId: 'education', time: '3 days ago', avatarColor: '#686ac8', avatarInitial: 'M', author: 'Manish Joshi' },
];

export const news: NewsItem[] = [
  { id: 'n1', headline: 'Restoration work begins at 12th century temple in Tamil Nadu', source: 'India', time: '2 hours ago', summary: 'The state government has approved the restoration work for this historic temple complex.', image: discussionImages[0], category: 'Heritage' },
  { id: 'n2', headline: "India's traditional knowledge systems gain global recognition", source: 'World', time: '5 hours ago', summary: 'Experts at the G20 forum highlighted the relevance of India\u2019s ancient knowledge systems.', image: hampiImage, category: 'Policy' },
  { id: 'n3', headline: 'New research highlights scientific benefits of ancient meditation', source: 'Science', time: '1 day ago', summary: 'A recent study finds measurable improvements in mental wellbeing and focus.', image: sunriseImage, category: 'Science' },
  { id: 'n4', headline: 'Digital archive launched for ancient Sanskrit manuscripts', source: 'Culture', time: '2 days ago', summary: 'Over 10,000 manuscripts have been digitized and made available for public access.', image: manuscriptImage, category: 'Heritage' },
  { id: 'n5', headline: 'UNESCO adds another Indian festival to intangible heritage list', source: 'World', time: '3 days ago', summary: 'The recognition highlights the living tradition\u2019s cultural significance.', image: templeImage2, category: 'Culture' },
  { id: 'n6', headline: 'New policy framework for temple conservation announced', source: 'Policy', time: '4 days ago', summary: 'The framework aims to standardize conservation practices across states.', image: hampiImage2, category: 'Policy' },
];

export const trending: TrendingTopic[] = [
  ['Temple Conservation', '245 discussions'],
  ['Bhagavad Gita', '193 discussions'],
  ['Youth & Values', '178 discussions'],
  ['Ancient Indian Science', '162 discussions'],
  ['Education Policy', '140 discussions'],
];

export const featuredNews: NewsItem[] = [
  { id: 'nf1', headline: 'Restoration work begins at 12th century temple in Tamil Nadu', source: 'India', time: '2 hours ago', summary: 'The state government has approved a major restoration project for this historic temple complex, aimed at preserving its architecture and inscriptions for future generations.', image: discussionImages[0], category: 'Heritage' },
  { id: 'nf2', headline: "India's traditional knowledge systems gain global recognition at G20", source: 'World', time: '5 hours ago', summary: 'Experts at the G20 forum highlighted the relevance of India\u2019s ancient knowledge systems for addressing contemporary global challenges.', image: hampiImage, category: 'Policy' },
];

export const articles: Article[] = [
  {
    id: 'a1',
    questionId: 'q1',
    question: "How can we preserve India's temple heritage for future generations?",
    title: 'Preserving Our Temples: A Blueprint for the Next Generation',
    author: 'Dr. Rajesh Kumar',
    authorInitial: 'R',
    authorColor: '#d78b43',
    category: 'History & Heritage',
    categoryId: 'history-heritage',
    subcategory: 'Temple Heritage',
    subcategoryId: 'temple-heritage',
    excerpt: 'India\u2019s temples are not just places of worship \u2014 they are living repositories of art, science, and civilizational memory. Their preservation requires a multi-layered approach.',
    content: [
      'India is home to thousands of temples, each a testament to centuries of artistic, scientific, and spiritual achievement. From the towering gopurams of the South to the intricate carvings of Khajuraho, these structures represent a continuous tradition of craftsmanship spanning over two millennia.',
      'Yet, the preservation of this heritage faces unprecedented challenges. Urbanization, environmental degradation, and in some cases, neglect, threaten the very existence of these cultural landmarks. The question before us is not merely architectural \u2014 it is civilizational.',
      'A comprehensive preservation strategy must address several dimensions simultaneously. First, the structural integrity of temple complexes requires ongoing assessment using modern engineering techniques combined with traditional knowledge of materials and construction.',
      'Second, the intangible heritage \u2014 the rituals, festivals, music, and dance associated with each temple \u2014 must be documented and supported. A temple without its living traditions is merely a museum piece.',
      'Third, community engagement is essential. Temples have always been centers of community life. Preservation efforts that exclude local communities are destined to fail. We must empower local custodians with both resources and authority.',
      'Finally, technology offers new possibilities. Digital documentation, 3D scanning, and virtual reconstruction can preserve knowledge even when physical structures are lost. But technology must serve, not replace, the human connections that make temples living heritage.',
    ],
    likes: 248,
    dislikes: 12,
    readTime: '6 min read',
    publishedAt: '3 days ago',
    comments: [
      {
        id: 'c1',
        author: 'Sneha Iyer',
        authorInitial: 'S',
        authorColor: '#78a77b',
        text: 'Excellent analysis. The point about intangible heritage is often overlooked. A temple is not just stone \u2014 it is the people, the rituals, the seasonal rhythms.',
        time: '2 days ago',
        replies: [
          { id: 'c1r1', author: 'Dr. Rajesh Kumar', authorInitial: 'R', authorColor: '#d78b43', text: 'Thank you, Sneha. You\u2019re absolutely right \u2014 the living tradition is what distinguishes our temples from mere monuments.', time: '2 days ago' },
        ],
      },
      {
        id: 'c2',
        author: 'Vikram Singh',
        authorInitial: 'V',
        authorColor: '#5f8ca2',
        text: 'Would love to see more discussion on how digital tools can be made accessible to local temple custodians, not just researchers.',
        time: '1 day ago',
      },
    ],
  },
  {
    id: 'a2',
    questionId: 'q2',
    question: 'What is the relevance of Bhagavad Gita in modern life?',
    title: 'The Gita in the Age of Anxiety: Timeless Wisdom for Modern Lives',
    author: 'Prof. Ananya Gupta',
    authorInitial: 'A',
    authorColor: '#bc7f23',
    category: 'Scriptures & Philosophy',
    categoryId: 'scriptures-philosophy',
    subcategory: 'Bhagavad Gita',
    subcategoryId: 'bhagavad-gita',
    excerpt: 'The Bhagavad Gita\u2019s teachings on equanimity, duty without attachment, and self-knowledge offer a practical framework for navigating the complexities of modern life.',
    content: [
      'The Bhagavad Gita, composed over two millennia ago, addresses a fundamental human condition: the paralysis of action in the face of moral complexity. Arjuna\u2019s dilemma on the battlefield is, in many ways, the dilemma of every modern individual facing difficult choices.',
      'The Gita\u2019s core teaching \u2014 Nishkama Karma, or action without attachment to results \u2014 is perhaps more relevant today than ever. In an age of constant measurement, comparison, and outcome-obsession, the Gita offers a radical alternative: do your duty, do it well, but do not be bound by the fruits.',
      'This is not a call to indifference. Rather, it is a call to integrity. When we act without being paralyzed by the fear of failure or the craving for success, we act from a place of inner steadiness. The Gita calls this sthitaprajna \u2014 the wisdom of one whose mind is established in equanimity.',
      'In our age of anxiety, where mental health challenges are pervasive, the Gita\u2019s emphasis on self-knowledge and emotional regulation offers a time-tested framework. It does not promise an easy life, but it offers a way to live with clarity and purpose regardless of circumstances.',
    ],
    likes: 312,
    dislikes: 8,
    readTime: '5 min read',
    publishedAt: '1 week ago',
    comments: [
      {
        id: 'c3',
        author: 'Karthik Reddy',
        authorInitial: 'K',
        authorColor: '#d48c46',
        text: 'The connection between Nishkama Karma and modern anxiety is powerful. This deserves wider discussion.',
        time: '5 days ago',
      },
    ],
  },
];

export const boardSections: BoardSection[] = [
  { id: 'preamble', title: 'Preamble & Purpose', description: 'The foundational vision and objectives of the Sanatan Board.', articles: 4 },
  { id: 'governance', title: 'Governance Structure', description: 'Administrative framework, roles, and responsibilities.', articles: 8 },
  { id: 'heritage-act', title: 'Heritage Preservation Act', description: 'Legal provisions for the protection of cultural heritage sites.', articles: 12 },
  { id: 'education', title: 'Education & Curriculum', description: 'Guidelines for value-based and heritage-aware education.', articles: 6 },
  { id: 'temples', title: 'Temple Administration', description: 'Standards for the management and upkeep of temple complexes.', articles: 10 },
  { id: 'research', title: 'Research & Documentation', description: 'Framework for research into traditional knowledge systems.', articles: 7 },
];

export const adminStats = [
  { label: 'Total Questions', value: '1,248', change: '+34 this week' },
  { label: 'Total Answers', value: '4,672', change: '+128 this week' },
  { label: 'Active Users', value: '8,934', change: '+312 this week' },
  { label: 'Pending Moderation', value: '23', change: '5 urgent' },
];

export const adminUsers = [
  { name: 'Arjun Mehta', role: 'Member', joined: 'Jan 2026', answers: 42, status: 'Active' },
  { name: 'Neha Sharma', role: 'Contributor', joined: 'Dec 2025', answers: 87, status: 'Active' },
  { name: 'Rahul Verma', role: 'Member', joined: 'Feb 2026', answers: 15, status: 'Active' },
  { name: 'Sneha Iyer', role: 'Moderator', joined: 'Nov 2025', answers: 134, status: 'Active' },
  { name: 'Karthik Reddy', role: 'Contributor', joined: 'Jan 2026', answers: 56, status: 'Suspended' },
];

export const moderationQueue = [
  { id: 'm1', type: 'Answer', content: 'A response on the Bhagavad Gita question flagged for review.', author: 'User_4821', reason: 'Potential misinformation', time: '15 min ago', severity: 'high' },
  { id: 'm2', type: 'Comment', content: 'A comment on temple preservation discussion.', author: 'User_3902', reason: 'Inappropriate language', time: '1 hour ago', severity: 'medium' },
  { id: 'm3', type: 'Question', content: 'A new question awaiting admin approval.', author: 'User_5510', reason: 'New question review', time: '2 hours ago', severity: 'low' },
];

export const newsSources = [
  { name: 'Press Information Bureau', status: 'Active', articles: 342, lastSync: '5 min ago' },
  { name: 'Archaeological Survey of India', status: 'Active', articles: 128, lastSync: '1 hour ago' },
  { name: 'UNESCO Heritage Feed', status: 'Active', articles: 67, lastSync: '3 hours ago' },
  { name: 'Ministry of Culture', status: 'Paused', articles: 89, lastSync: '2 days ago' },
];

export const profileData = {
  name: 'Arjun Mehta',
  initial: 'A',
  color: '#cf7847',
  bio: 'Heritage enthusiast. Exploring the intersection of ancient wisdom and modern life.',
  joined: 'January 2026',
  stats: { answers: 42, articles: 8, drafts: 3, saved: 17 },
};

export const profileActivity = [
  { type: 'answer', title: 'Answered: How can we promote value-based education?', time: '2 hours ago' },
  { type: 'comment', title: 'Commented on: Temple preservation blueprint', time: '5 hours ago' },
  { type: 'save', title: 'Saved: The Gita in the Age of Anxiety', time: '1 day ago' },
  { type: 'draft', title: 'Draft: The role of youth in cultural preservation', time: '2 days ago' },
];

export const profileDrafts = [
  { id: 'd1', title: 'The role of youth in cultural preservation', updated: '2 days ago', words: 1240 },
  { id: 'd2', title: 'Understanding the Gurukul system', updated: '5 days ago', words: 680 },
  { id: 'd3', title: 'Ayurveda and modern wellness', updated: '1 week ago', words: 320 },
];

export const profileSaved = [
  { id: 's1', title: 'Preserving Our Temples: A Blueprint', type: 'Article', time: '3 days ago' },
  { id: 's2', title: 'What is the relevance of Bhagavad Gita?', type: 'Question', time: '1 week ago' },
  { id: 's3', title: 'Restoration work begins at 12th century temple', type: 'News', time: '2 hours ago' },
];

export const notifications = [
  { id: 'nt1', type: 'answer', text: 'Dr. Rajesh Kumar answered your question on temple heritage', time: '10 min ago', unread: true },
  { id: 'nt2', type: 'comment', text: 'Sneha Iyer commented on your article about value-based education', time: '1 hour ago', unread: true },
  { id: 'nt3', type: 'like', text: 'Your answer on Yoga and Meditation received 12 new likes', time: '3 hours ago', unread: true },
  { id: 'nt4', type: 'mention', text: 'You were mentioned in a discussion on Ancient Indian Science', time: '5 hours ago', unread: false },
  { id: 'nt5', type: 'news', text: 'New current affairs article: Digital archive for Sanskrit manuscripts', time: '1 day ago', unread: false },
];

export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function getQuestionById(id: string): Question | undefined {
  return [...discussions.map(d => ({ id: d.id, question: d.title, answers: d.answers, comments: d.comments, category: d.category, categoryId: d.categoryId, subcategory: d.subcategory, subcategoryId: d.subcategoryId, time: '3 days ago', avatarColor: d.participants[0], avatarInitial: 'A', author: 'Admin' })), ...questions].find((q) => q.id === id);
}

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function getNewsById(id: string): NewsItem | undefined {
  return news.find((n) => n.id === id);
}

export function getQuestionsByCategory(categoryId: string): Question[] {
  return questions.filter((q) => q.categoryId === categoryId);
}

export function getDiscussionsByCategory(categoryId: string): Discussion[] {
  return discussions.filter((d) => d.categoryId === categoryId);
}

export function getNewsByCategory(category: string): NewsItem[] {
  return news.filter((n) => n.category === category);
}

export function getRelatedQuestions(questionId: string, categoryId: string): Question[] {
  return questions.filter((q) => q.categoryId === categoryId && q.id !== questionId).slice(0, 4);
}
