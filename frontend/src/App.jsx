import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AuthContext from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-950">
    <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-brand-600 rounded-full animate-spin"></div>
    <div className="mt-4 text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading DeenFlow...</div>
  </div>
)

// Public Pages
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'))
const Login = lazy(() => import('./pages/Auth/Login'))
const Register = lazy(() => import('./pages/Auth/Register'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const UpdatesPage = lazy(() => import('./pages/UpdatesPage'))
const ChangelogPage = lazy(() => import('./pages/ChangelogPage'))

// Member Pages
const MemberLayout = lazy(() => import('./components/Member/MemberLayout'))
const MemberDashboardPage = lazy(() => import('./pages/Member/MemberDashboardPage'))
const AskQuestionPage = lazy(() => import('./pages/Member/AskQuestionPage'))
const MyQuestionsPage = lazy(() => import('./pages/Member/MyQuestionsPage'))
const AnswerDetailPage = lazy(() => import('./pages/Member/AnswerDetailPage'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const SavedReflections = lazy(() => import('./pages/SavedReflections'))
const UpgradePage = lazy(() => import('./pages/Member/UpgradePage'))
const DonationsPage = lazy(() => import('./pages/Member/DonationsPage'))
const ConsultationsPage = lazy(() => import('./pages/Member/ConsultationsPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const LearningPaths = lazy(() => import('./pages/LearningPaths'))
const LessonListPage = lazy(() => import('./pages/Member/LessonListPage'))
const LessonDetailPage = lazy(() => import('./pages/Member/LessonDetailPage'))
const DeenPlanner = lazy(() => import('./pages/DeenPlanner'))

// Worship Pages
const DailyDhikrPage = lazy(() => import('./pages/Worship/DailyDhikrPage'))
const DuaBySituationPage = lazy(() => import('./pages/Worship/DuaBySituationPage'))
const QuranicDuasPage = lazy(() => import('./pages/Worship/QuranicDuasPage'))
const NamesOfAllahPage = lazy(() => import('./pages/Worship/NamesOfAllahPage'))
const TasbihPage = lazy(() => import('./pages/Worship/TasbihPage'))
const PrayerTimesPage = lazy(() => import('./pages/Worship/PrayerTimesPage'))
const AdhanSettingsPage = lazy(() => import('./pages/Worship/AdhanSettingsPage'))
const QuranPlayerPage = lazy(() => import('./pages/Worship/QuranPlayerPage'))
const RemindersPage = lazy(() => import('./pages/Worship/RemindersPage'))
const FavoritesPage = lazy(() => import('./pages/Worship/FavoritesPage'))

// Quran Member
const QuranHome = lazy(() => import('./pages/quran/QuranHome'))
const SurahPage = lazy(() => import('./pages/quran/SurahPage'))
const JuzPage = lazy(() => import('./pages/quran/JuzPage'))

// Admin Pages
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'))
const AdminLayout = lazy(() => import('./components/Admin/AdminLayout'))
const AdminDashboardPage = lazy(() => import('./pages/Admin/AdminDashboardPage'))
const AdminProfilePage = lazy(() => import('./pages/Admin/AdminProfilePage'))
const AdminSettingsPage = lazy(() => import('./pages/Admin/AdminSettingsPage'))
const AIInteractionLogsPage = lazy(() => import('./pages/Admin/AIInteractionLogsPage'))
const AIAnswerReviewPanel = lazy(() => import('./pages/Admin/AIAnswerReviewPanel'))
const FlaggedAIAnswersPage = lazy(() => import('./pages/Admin/FlaggedAIAnswersPage'))
const ContentListPage = lazy(() => import('./pages/Admin/ContentListPage'))
const ContentEditorPage = lazy(() => import('./pages/Admin/ContentEditorPage'))
const UsersListPage = lazy(() => import('./pages/Admin/UsersListPage'))
const AIConfigurationPage = lazy(() => import('./pages/Admin/AIConfigurationPage'))
const ScholarsManagementPage = lazy(() => import('./pages/Admin/ScholarsManagementPage'))
const RolesPermissionsPage = lazy(() => import('./pages/Admin/RolesPermissionsPage'))
const CategoriesAndTagsPage = lazy(() => import('./pages/Admin/CategoriesAndTagsPage'))
const ReportedContentPage = lazy(() => import('./pages/Admin/ReportedContentPage'))
const QuranAdminHome = lazy(() => import('./pages/Admin/Quran/QuranAdminHome'))
const TranslationsAdmin = lazy(() => import('./pages/Admin/Quran/TranslationsAdmin'))
const RecitationsAdmin = lazy(() => import('./pages/Admin/Quran/RecitationsAdmin'))
const FiqhLibraryPage = lazy(() => import('./pages/Admin/FiqhLibraryPage'))
const RulingEditorPage = lazy(() => import('./pages/Admin/RulingEditorPage'))
const ModerationQueuePage = lazy(() => import('./pages/Admin/ModerationQueuePage'))
const ReviewPanelPage = lazy(() => import('./pages/Admin/ReviewPanelPage'))
const AuditLogPage = lazy(() => import('./pages/Admin/AuditLogPage'))
const AnalyticsPage = lazy(() => import('./pages/Admin/AnalyticsPage'))
const AdminMessagingPage = lazy(() => import('./pages/Admin/AdminMessagingPage'))
const AdminWorshipPage = lazy(() => import('./pages/Admin/AdminWorshipPage'))
const MessagesPage = lazy(() => import('./pages/Member/MessagesPage'))


function HomeRedirect() {
  const { user } = React.useContext(AuthContext)
  if (!user) return <Navigate to="/" replace />
  if (user.is_admin) return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/app/dashboard" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
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
                <Route path="messages" element={<AdminMessagingPage />} />

                {/* Worship Management */}
                <Route path="worship" element={<AdminWorshipPage />} />

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
                <Route path="messages" element={<MessagesPage />} />

                {/* Worship Routes */}
                <Route path="worship/dhikr" element={<DailyDhikrPage />} />
                <Route path="worship/duas" element={<DuaBySituationPage />} />
                <Route path="worship/quranic-duas" element={<QuranicDuasPage />} />
                <Route path="worship/names-of-allah" element={<NamesOfAllahPage />} />
                <Route path="worship/tasbih" element={<TasbihPage />} />
                <Route path="worship/prayer-times" element={<PrayerTimesPage />} />
                <Route path="worship/adhan-settings" element={<AdhanSettingsPage />} />
                <Route path="worship/quran-audio" element={<QuranPlayerPage />} />
                <Route path="worship/reminders" element={<RemindersPage />} />
                <Route path="worship/favorites" element={<FavoritesPage />} />
              </Route>

              {/* Fallback redirect */}
              <Route path="*" element={<HomeRedirect />} />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

