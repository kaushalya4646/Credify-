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
    </Routes>
  )
}