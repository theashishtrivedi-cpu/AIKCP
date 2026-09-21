import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import QuestionsPage from '@/pages/QuestionsPage';
import QuestionDetailPage from '@/pages/QuestionDetailPage';
import ArticlePage from '@/pages/ArticlePage';
import CategoryPage from '@/pages/CategoryPage';
import SubcategoryPage from '@/pages/SubcategoryPage';
import CurrentAffairsPage from '@/pages/CurrentAffairsPage';
import CurrentAffairsDetailPage from '@/pages/CurrentAffairsDetailPage';
import SanatanBoardPage from '@/pages/SanatanBoardPage';
import SearchPage from '@/pages/SearchPage';
import ProfilePage from '@/pages/ProfilePage';
import NotificationsPage from '@/pages/NotificationsPage';
import AdminPage from '@/pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#fbfaf7] text-[#182331] selection:bg-[#f5b544] selection:text-[#33200f]">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/questions/:questionId" element={<QuestionDetailPage />} />
          <Route path="/articles/:articleId" element={<ArticlePage />} />
          <Route path="/categories/:categoryId" element={<CategoryPage />} />
          <Route path="/categories/:categoryId/:subcategoryId" element={<SubcategoryPage />} />
          <Route path="/current-affairs" element={<CurrentAffairsPage />} />
          <Route path="/current-affairs/:articleId" element={<CurrentAffairsDetailPage />} />
          <Route path="/sanatan-board" element={<SanatanBoardPage />} />
          <Route path="/sanatan-board/:sectionId" element={<SanatanBoardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
