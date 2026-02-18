import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import { AuthProvider } from './contexts/AuthContext'
import AuthContext from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Member Components
import MemberLayout from './components/Member/MemberLayout'
import MemberDashboardPage from './pages/Member/MemberDashboardPage'
import NewGuidance from './pages/NewGuidance'
import GuidanceResult from './pages/GuidanceResult'
import History from './pages/History'
import SavedReflections from './pages/SavedReflections'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

// Quran Member
import QuranHome from './pages/quran/QuranHome'
import SurahPage from './pages/quran/SurahPage'
import JuzPage from './pages/quran/JuzPage'
import DeenPlanner from './pages/DeenPlanner'
import LearningPaths from './pages/LearningPaths'


// Admin Components
import AdminLogin from './pages/Admin/AdminLogin'
import AdminLayout from './components/Admin/AdminLayout'
import AdminDashboardPage from './pages/Admin/AdminDashboardPage'
import AIInteractionLogsPage from './pages/Admin/AIInteractionLogsPage'
import AIAnswerReviewPanel from './pages/Admin/AIAnswerReviewPanel'
import FlaggedAIAnswersPage from './pages/Admin/FlaggedAIAnswersPage'
import ContentListPage from './pages/Admin/ContentListPage'
import UsersListPage from './pages/Admin/UsersListPage'

// Quran Admin
import QuranAdminHome from './pages/Admin/Quran/QuranAdminHome'
import TranslationsAdmin from './pages/Admin/Quran/TranslationsAdmin'
import RecitationsAdmin from './pages/Admin/Quran/RecitationsAdmin'


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

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<AdminRoute><ProtectedRoute><AdminLayout /></ProtectedRoute></AdminRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />

            {/* AI Supervision */}
            <Route path="ai/logs" element={<AIInteractionLogsPage />} />
            <Route path="ai/review/:id" element={<AIAnswerReviewPanel />} />
            <Route path="ai/flagged" element={<FlaggedAIAnswersPage />} />

            {/* Content Management */}
            <Route path="content" element={<ContentListPage />} />
            <Route path="users" element={<UsersListPage />} />

            {/* Quran Admin */}
            <Route path="quran" element={<QuranAdminHome />} />
            <Route path="quran/translations" element={<TranslationsAdmin />} />
            <Route path="quran/recitations" element={<RecitationsAdmin />} />
            <Route path="quran/sync" element={<div className="p-8">Sync Logs - Coming Soon</div>} />


            {/* Placeholder routes for remaining pages */}
            <Route path="content/:id/edit" element={<div className="p-8 text-slate-600 dark:text-slate-400">Content Editor - Coming Soon</div>} />
            <Route path="reviews" element={<div className="p-8 text-slate-600 dark:text-slate-400">Content Reviews - Coming Soon</div>} />
            <Route path="scholars" element={<div className="p-8 text-slate-600 dark:text-slate-400">Scholars Management - Coming Soon</div>} />
            <Route path="roles" element={<div className="p-8 text-slate-600 dark:text-slate-400">Roles & Permissions - Coming Soon</div>} />
            <Route path="moderation" element={<div className="p-8 text-slate-600 dark:text-slate-400">Moderation - Coming Soon</div>} />
            <Route path="analytics" element={<div className="p-8 text-slate-600 dark:text-slate-400">Analytics - Coming Soon</div>} />
            <Route path="settings/ai" element={<div className="p-8 text-slate-600 dark:text-slate-400">AI Configuration - Coming Soon</div>} />
            <Route path="settings/categories" element={<div className="p-8 text-slate-600 dark:text-slate-400">Categories & Tags - Coming Soon</div>} />
            <Route path="audit-logs" element={<div className="p-8 text-slate-600 dark:text-slate-400">Audit Logs - Coming Soon</div>} />
          </Route>

          {/* Member Routes - Using new MemberLayout */}
          <Route path="/app" element={<ProtectedRoute><MemberLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<MemberDashboardPage />} />
            <Route path="ask-ai" element={<NewGuidance />} />
            <Route path="my-questions" element={<History />} />
            <Route path="result/:id" element={<GuidanceResult />} />
            <Route path="saved" element={<SavedReflections />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />

            {/* Quran Member */}
            <Route path="quran" element={<QuranHome />} />
            <Route path="quran/surah/:id" element={<SurahPage />} />
            <Route path="quran/juz/:number" element={<JuzPage />} />

            {/* Deen Planner */}
            <Route path="planner" element={<DeenPlanner />} />



            {/* Placeholder routes for new member features */}
            <Route path="learning" element={<LearningPaths />} />
            <Route path="learning/:slug" element={<div className="p-8">Lesson List - Coming Soon</div>} />

            <Route path="community" element={<div className="p-8 text-slate-600 dark:text-slate-400">Community - Coming Soon</div>} />
            <Route path="community/mine" element={<div className="p-8 text-slate-600 dark:text-slate-400">My Posts - Coming Soon</div>} />
            <Route path="activity" element={<div className="p-8 text-slate-600 dark:text-slate-400">Activity - Coming Soon</div>} />
            <Route path="notifications" element={<div className="p-8 text-slate-600 dark:text-slate-400">Notifications - Coming Soon</div>} />
          </Route>

          {/* Legacy root redirect */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  )
}

