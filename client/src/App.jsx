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

{/*import AdminSkillsPage from './pages/AdminSkillsPage'
import AdminAssessmentsPage from './pages/AdminAssessmentsPage'
import AdminReportsPage from './pages/AdminReportsPage'
import AdminSystemSettingsPage from './pages/AdminSystemSettingsPage'*/}

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

      {/*<Route path="/admin/skills" element={<AdminSkillsPage />} />
      <Route path="/admin/assessments" element={<AdminAssessmentsPage />} />
      <Route path="/admin/reports" element={<AdminReportsPage />} />
      <Route path="/admin/settings" element={<AdminSystemSettingsPage />} /> */}

    </Routes>
  )
}