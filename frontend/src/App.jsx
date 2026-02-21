import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import { AuthProvider } from './contexts/AuthContext'
import AuthContext from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import AskQuestionPage from './pages/Member/AskQuestionPage'
import MyQuestionsPage from './pages/Member/MyQuestionsPage'
import AnswerDetailPage from './pages/Member/AnswerDetailPage'

// Member Components
import MemberLayout from './components/Member/MemberLayout'
import MemberDashboardPage from './pages/Member/MemberDashboardPage'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import SavedReflections from './pages/SavedReflections'
import UpgradePage from './pages/Member/UpgradePage'
import DonationsPage from './pages/Member/DonationsPage'
import ConsultationsPage from './pages/Member/ConsultationsPage'
import NotificationsPage from './pages/NotificationsPage'

// Quran Member
import QuranHome from './pages/quran/QuranHome'
import SurahPage from './pages/quran/SurahPage'
import JuzPage from './pages/quran/JuzPage'
import DeenPlanner from './pages/DeenPlanner'

// Admin Components
import AdminLogin from './pages/Admin/AdminLogin'
import AdminLayout from './components/Admin/AdminLayout'
import AdminDashboardPage from './pages/Admin/AdminDashboardPage'
import AdminProfilePage from './pages/Admin/AdminProfilePage'
import AdminSettingsPage from './pages/Admin/AdminSettingsPage'
import AIInteractionLogsPage from './pages/Admin/AIInteractionLogsPage'
import AIAnswerReviewPanel from './pages/Admin/AIAnswerReviewPanel'
import FlaggedAIAnswersPage from './pages/Admin/FlaggedAIAnswersPage'
import ContentListPage from './pages/Admin/ContentListPage'
import ContentEditorPage from './pages/Admin/ContentEditorPage'
import UsersListPage from './pages/Admin/UsersListPage'
import AIConfigurationPage from './pages/Admin/AIConfigurationPage'
import ScholarsManagementPage from './pages/Admin/ScholarsManagementPage'
import RolesPermissionsPage from './pages/Admin/RolesPermissionsPage'
import CategoriesAndTagsPage from './pages/Admin/CategoriesAndTagsPage'
import ReportedContentPage from './pages/Admin/ReportedContentPage'

// Quran Admin
import QuranAdminHome from './pages/Admin/Quran/QuranAdminHome'
import TranslationsAdmin from './pages/Admin/Quran/TranslationsAdmin'
import RecitationsAdmin from './pages/Admin/Quran/RecitationsAdmin'

import FiqhLibraryPage from './pages/Admin/FiqhLibraryPage'
import RulingEditorPage from './pages/Admin/RulingEditorPage'
import ModerationQueuePage from './pages/Admin/ModerationQueuePage'
import ReviewPanelPage from './pages/Admin/ReviewPanelPage'
import AuditLogPage from './pages/Admin/AuditLogPage'
import AnalyticsPage from './pages/Admin/AnalyticsPage'
import LearningPaths from './pages/LearningPaths'
import LessonListPage from './pages/Member/LessonListPage'
import LessonDetailPage from './pages/Member/LessonDetailPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'
import UpdatesPage from './pages/UpdatesPage'
import ChangelogPage from './pages/ChangelogPage'


function HomeRedirect() {
  const { user } = React.useContext(AuthContext)
  if (!user) return <Navigate to="/login" replace />
  if (user.is_admin) return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/app/dashboard" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />


          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<AdminRoute><ProtectedRoute><AdminLayout /></ProtectedRoute></AdminRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />

            {/* Account */}
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="settings" element={<AdminSettingsPage />} />

            {/* AI Supervision */}
            <Route path="ai/logs" element={<AIInteractionLogsPage />} />
            <Route path="questions" element={<AIInteractionLogsPage />} />
            <Route path="ai/review/:id" element={<AIAnswerReviewPanel />} />
            <Route path="ai/flagged" element={<FlaggedAIAnswersPage />} />
            <Route path="answers" element={<FlaggedAIAnswersPage />} />

            {/* Fiqh Library */}
            <Route path="fiqh" element={<FiqhLibraryPage />} />
            <Route path="fiqh/new" element={<RulingEditorPage />} />
            <Route path="fiqh/edit/:id" element={<RulingEditorPage />} />

            {/* Moderation Queue */}
            <Route path="reviews" element={<ModerationQueuePage />} />
            <Route path="reviews/:id" element={<ReviewPanelPage />} />

            {/* Content Management */}
            <Route path="content" element={<ContentListPage />} />
            <Route path="users" element={<UsersListPage />} />

            {/* Quran Admin */}
            <Route path="quran" element={<QuranAdminHome />} />
            <Route path="quran/translations" element={<TranslationsAdmin />} />
            <Route path="quran/recitations" element={<RecitationsAdmin />} />
            <Route path="quran/sync" element={<div className="p-8">Sync Logs - Coming Soon</div>} />

            {/* Content Editor */}
            <Route path="content/new" element={<ContentEditorPage />} />
            <Route path="content/:id/edit" element={<ContentEditorPage />} />

            {/* Scholars & Community */}
            <Route path="scholars" element={<ScholarsManagementPage />} />
            <Route path="roles" element={<RolesPermissionsPage />} />
            <Route path="moderation" element={<ReportedContentPage />} />

            {/* Settings */}
            <Route path="settings/ai" element={<AIConfigurationPage />} />
            <Route path="settings/categories" element={<CategoriesAndTagsPage />} />
            <Route path="audit" element={<AuditLogPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>

          {/* Member Routes - Using new MemberLayout */}
          <Route path="/app" element={<ProtectedRoute><MemberLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<MemberDashboardPage />} />
            <Route path="ask-ai" element={<AskQuestionPage />} />
            <Route path="my-questions" element={<MyQuestionsPage />} />
            <Route path="result/:id" element={<AnswerDetailPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="saved" element={<SavedReflections />} />
            <Route path="upgrade" element={<UpgradePage />} />

            {/* Quran Member */}
            <Route path="quran" element={<QuranHome />} />
            <Route path="quran/surah/:id" element={<SurahPage />} />
            <Route path="quran/juz/:number" element={<JuzPage />} />

            {/* Deen Planner */}
            <Route path="planner" element={<DeenPlanner />} />

            {/* Academy Features */}
            <Route path="learning" element={<LearningPaths />} />
            <Route path="learning/:slug" element={<LessonListPage />} />
            <Route path="lessons/:id" element={<LessonDetailPage />} />

            <Route path="donations" element={<DonationsPage />} />
            <Route path="consultation" element={<ConsultationsPage />} />
            <Route path="marketplace" element={<div className="p-8">Islamic Marketplace - Coming Soon</div>} />

            <Route path="community" element={<div className="p-8 text-slate-600 dark:text-slate-400">Community - Coming Soon</div>} />
            <Route path="community/mine" element={<div className="p-8 text-slate-600 dark:text-slate-400">My Posts - Coming Soon</div>} />
            <Route path="activity" element={<div className="p-8 text-slate-600 dark:text-slate-400">Activity - Coming Soon</div>} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Legacy root redirect */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  )
}

