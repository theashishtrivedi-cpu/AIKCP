import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import RealQuestionsPage from '@/pages/RealQuestionsPage';
import QuestionDetailPage from '@/pages/QuestionDetailPage';
import RealQuestionDetailPage from '@/pages/RealQuestionDetailPage';
import ArticlePage from '@/pages/ArticlePage';
import CategoryPage from '@/pages/CategoryPage';
import SubcategoryPage from '@/pages/SubcategoryPage';
import CurrentAffairsPage from '@/pages/CurrentAffairsPage';
import CurrentAffairsDetailPage from '@/pages/CurrentAffairsDetailPage';
import SanatanBoardPage from '@/pages/SanatanBoardPage';
import SanatanBoardContentPage from '@/pages/SanatanBoardContentPage';
import SearchPage from '@/pages/SearchPage';
import ProfilePage from '@/pages/ProfilePage';
import NotificationsPage from '@/pages/NotificationsPage';
import AdminPage from '@/pages/AdminPage';
import LoginPage from '@/pages/LoginPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import SignupPage from '@/pages/SignupPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  const isRecoverySession =
    typeof window !== 'undefined' &&
    window.location.hash.includes('type=recovery');

  if (isRecoverySession) {
    return (
      <BrowserRouter>
        <ResetPasswordPage />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#fbfaf7] text-[#182331] selection:bg-[#f5b544] selection:text-[#33200f]">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/questions" element={<RealQuestionsPage />} />
          <Route path="/questions/:questionId" element={<RealQuestionDetailPage />} />
          <Route path="/real-questions/:questionId" element={<RealQuestionDetailPage />} />
          <Route path="/articles/:articleId" element={<ArticlePage />} />
          <Route path="/categories/:categoryId" element={<CategoryPage />} />
          <Route path="/categories/:categoryId/:subcategoryId" element={<SubcategoryPage />} />
          <Route path="/current-affairs" element={<CurrentAffairsPage />} />
          <Route path="/current-affairs/:articleId" element={<CurrentAffairsDetailPage />} />

          <Route
            path="/sanatan-board"
            element={<SanatanBoardPage />}
          />
          <Route
            path="/sanatan-board/content/:contentId"
            element={<SanatanBoardContentPage />}
          />
          <Route
            path="/sanatan-board/:sectionId"
            element={<SanatanBoardPage />}
          />

          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;


