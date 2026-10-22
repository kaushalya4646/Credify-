import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import WhyCredify from '../components/WhyCredify'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <WhyCredify />
        <CTA />
        {/* TEMP: dev-only shortcuts until backend auth is wired — remove before submission */}
        <div className="flex gap-3 justify-center py-10">
          <Link to="/candidate/dashboard" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
            Candidate Dashboard
          </Link>
          <Link to="/recruiter/dashboard" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
            Recruiter Dashboard
          </Link>
          <Link to="/admin/dashboard" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
            Admin Dashboard
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  )
}