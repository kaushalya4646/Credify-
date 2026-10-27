import { Routes, Route } from 'react-router-dom'
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
import AdminVerificationRecordsPage from './pages/AdminVerificationRecordsPage'
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/candidate/dashboard" element={<CandidateDashboardPage />} />
      <Route path="/candidate/profile" element={<CandidateProfilePage />} />
      <Route path="/candidate/career-role" element={<CareerRolePage />} />
      <Route path="/candidate/assessments" element={<AssessmentsPage />} />
      <Route path="/candidate/assessments/results" element={<AssessmentResultPage />} />
      <Route path="/candidate/skill-gaps" element={<SkillGapsPage />} />
      <Route path="/candidate/assessments/screen" element={<AssessmentScreenPage />} />

      <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
      <Route path="/recruiter/find-candidates" element={<FindCandidatesPage />} />
      <Route path="/recruiter/jobs/create" element={<CreateJobVacancyPage />} />
      <Route path="/recruiter/saved-candidates" element={<SavedCandidatesPage />} />
      <Route path="/recruiter/profile" element={<RecruiterProfilePage />} />
      <Route path="/recruiter/candidates/:id" element={<CandidateProfileRecruiterViewPage />} />

      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/career-roles" element={<AdminCareerRolesPage />} />
      <Route path="/admin/skills" element={<AdminSkillsPage />} />
      <Route path="/admin/assessments" element={<AdminAssessmentsPage />} />
      <Route path="/admin/reports" element={<AdminReportsPage />} />
      <Route path="/admin/settings" element={<AdminSystemSettingsPage />} /> 

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/login/verify" element={<TwoFactorVerificationPage />} />

      <Route path="/candidate/career-role/:id" element={<CareerRoleDetailsPage />} />
      <Route path="/candidate/assessments/:id/start" element={<AssessmentInstructionsPage />} />

      <Route path="/recruiter/jobs" element={<MyJobsPage />} />

      <Route path="/admin/assessments/editor" element={<AdminAssessmentEditorPage />} />
      <Route path="/admin/verification" element={<AdminVerificationRecordsPage />} />
      <Route path="/admin/content" element={<AdminPlatformContentPage />} />

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

    </Routes>
  )
}