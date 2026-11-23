import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CandidateDashboardPage from './pages/CandidateDashboardPage'
import CandidateProfilePage from './pages/CandidateProfilePage'
import CareerRolePage from './pages/CareerRolePage'
import AssessmentsPage from './pages/AssessmentsPage'
import AssessmentResultPage from './pages/AssessmentResultPage'
import SkillGapsPage from './pages/SkillGapsPage'
import AssessmentScreenPage from './pages/AssessmentScreenPage'

import RecruiterDashboardPage from './pages/RecruiterDashboardPage'
import FindCandidatesPage from './pages/FindCandidatesPage'
import CreateJobVacancyPage from './pages/CreateJobVacancyPage'
import SavedCandidatesPage from './pages/SavedCandidatesPage'
import RecruiterProfilePage from './pages/RecruiterProfilePage'
import CandidateProfileRecruiterViewPage from './pages/CandidateProfileRecruiterViewPage'

import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminCareerRolesPage from './pages/AdminCareerRolesPage'
import AdminSkillsPage from './pages/AdminSkillsPage'
import AdminAssessmentsPage from './pages/AdminAssessmentsPage'
import AdminReportsPage from './pages/AdminReportsPage'
import AdminSystemSettingsPage from './pages/AdminSystemSettingsPage'

import NotFoundPage from './pages/NotFoundPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import TwoFactorVerificationPage from './pages/TwoFactorVerificationPage'
import CareerRoleDetailsPage from './pages/CareerRoleDetailsPage'
import AssessmentInstructionsPage from './pages/AssessmentInstructionsPage'
import MyJobsPage from './pages/MyJobsPage'
import AdminAssessmentEditorPage from './pages/AdminAssessmentEditorPage'
import AdminPlatformContentPage from './pages/AdminPlatformContentPage'

// routes for pages in landing page(footer)
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import AboutUsPage from './pages/AboutUsPage'
import CareersPage from './pages/CareersPage'
import SuccessStoriesPage from './pages/SuccessStoriesPage'
import TalentSearchPage from './pages/TalentSearchPage'
import EnterpriseAuditingPage from './pages/EnterpriseAuditingPage'
import RequestDemoPage from './pages/RequestDemoPage'
import VerifyCredentialsPage from './pages/VerifyCredentialsPage'
import AssessmentsOverviewPage from './pages/AssessmentsOverviewPage'
import TalkToSalesPage from './pages/TalkToSalesPage'

import HelpCenterPage from './pages/HelpCenterPage'
import FeedbackPage from './pages/FeedbackPage'
import SettingsPage from './pages/SettingsPage'

import AdminHelpCenterManagePage from './pages/AdminHelpCenterManagePage'
import AdminPrivacyPolicyManagePage from './pages/AdminPrivacyPolicyManagePage'
import AdminTermsOfServiceManagePage from './pages/AdminTermsOfServiceManagePage'
import AdminAboutUsManagePage from './pages/AdminAboutUsManagePage'
import AdminFeedbackManagePage from './pages/AdminFeedbackManagePage'
import AdminProfilePage from './pages/AdminProfilePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/candidate/dashboard" element={<ProtectedRoute role="CANDIDATE"><CandidateDashboardPage /></ProtectedRoute>} />
      <Route path="/candidate/profile" element={<ProtectedRoute role="CANDIDATE"><CandidateProfilePage /></ProtectedRoute>} />
      <Route path="/candidate/career-role" element={<ProtectedRoute role="CANDIDATE"><CareerRolePage /></ProtectedRoute>} />
      <Route path="/candidate/assessments" element={<ProtectedRoute role="CANDIDATE"><AssessmentsPage /></ProtectedRoute>} />
      <Route path="/candidate/assessments/results/:attemptId" element={<ProtectedRoute role="CANDIDATE"><AssessmentResultPage /></ProtectedRoute>} />
      <Route path="/candidate/skill-gaps" element={<ProtectedRoute role="CANDIDATE"><SkillGapsPage /></ProtectedRoute>} />
      <Route path="/candidate/assessments/:id/screen" element={<ProtectedRoute role="CANDIDATE"><AssessmentScreenPage /></ProtectedRoute>} />

      <Route path="/recruiter/dashboard" element={<ProtectedRoute role="RECRUITER"><RecruiterDashboardPage /></ProtectedRoute>} />
      <Route path="/recruiter/find-candidates" element={<ProtectedRoute role="RECRUITER"><FindCandidatesPage /></ProtectedRoute>} />
      <Route path="/recruiter/jobs/create" element={<ProtectedRoute role="RECRUITER"><CreateJobVacancyPage /></ProtectedRoute>} />
      <Route path="/recruiter/saved-candidates" element={<ProtectedRoute role="RECRUITER"><SavedCandidatesPage /></ProtectedRoute>} />
      <Route path="/recruiter/profile" element={<ProtectedRoute role="RECRUITER"><RecruiterProfilePage /></ProtectedRoute>} />
      <Route path="/recruiter/candidates/:id" element={<ProtectedRoute role="RECRUITER"><CandidateProfileRecruiterViewPage /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><AdminUsersPage /></ProtectedRoute>} />
      <Route path="/admin/career-roles" element={<ProtectedRoute role="ADMIN"><AdminCareerRolesPage /></ProtectedRoute>} />
      <Route path="/admin/skills" element={<ProtectedRoute role="ADMIN"><AdminSkillsPage /></ProtectedRoute>} />
      <Route path="/admin/assessments" element={<ProtectedRoute role="ADMIN"><AdminAssessmentsPage /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute role="ADMIN"><AdminReportsPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="ADMIN"><AdminSystemSettingsPage /></ProtectedRoute>} />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/login/verify" element={<TwoFactorVerificationPage />} />

      <Route path="/candidate/career-role/:id" element={<ProtectedRoute role="CANDIDATE"><CareerRoleDetailsPage /></ProtectedRoute>} />
      <Route path="/candidate/assessments/:id/start" element={<ProtectedRoute role="CANDIDATE"><AssessmentInstructionsPage /></ProtectedRoute>} />

      <Route path="/recruiter/jobs" element={<ProtectedRoute role="RECRUITER"><MyJobsPage /></ProtectedRoute>} />

      <Route path="/admin/assessments/editor/:id" element={<ProtectedRoute role="ADMIN"><AdminAssessmentEditorPage /></ProtectedRoute>} />
      <Route path="/admin/content" element={<ProtectedRoute role="ADMIN"><AdminPlatformContentPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />

      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/success-stories" element={<SuccessStoriesPage />} />
      <Route path="/talent-search" element={<TalentSearchPage />} />
      <Route path="/enterprise-auditing" element={<EnterpriseAuditingPage />} />
      <Route path="/request-demo" element={<RequestDemoPage />} />
      <Route path="/verify-credentials" element={<VerifyCredentialsPage />} />
      <Route path="/assessments" element={<AssessmentsOverviewPage />} />
      <Route path="/talk-to-sales" element={<TalkToSalesPage/>} />

      <Route path="/help-center" element={<HelpCenterPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      <Route path="/admin/help-center" element={<ProtectedRoute role="ADMIN"><AdminHelpCenterManagePage /></ProtectedRoute>} />
      <Route path="/admin/privacy-policy" element={<ProtectedRoute role="ADMIN"><AdminPrivacyPolicyManagePage /></ProtectedRoute>} />
      <Route path="/admin/terms-of-service" element={<ProtectedRoute role="ADMIN"><AdminTermsOfServiceManagePage /></ProtectedRoute>} />
      <Route path="/admin/about-us" element={<ProtectedRoute role="ADMIN"><AdminAboutUsManagePage /></ProtectedRoute>} />
      <Route path="/admin/feedback" element={<ProtectedRoute role="ADMIN"><AdminFeedbackManagePage /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute role="ADMIN"><AdminProfilePage /></ProtectedRoute>} />

    </Routes>
  )
}