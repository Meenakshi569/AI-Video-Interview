import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import CandidateDashboardPage from '../pages/candidate/CandidateDashboardPage.jsx';
import HardwareCheckPage from '../pages/candidate/HardwareCheckPage.jsx';
import InterviewPage from '../pages/candidate/InterviewPage.jsx';
import InterviewCompletePage from '../pages/candidate/InterviewCompletePage.jsx';
import RecruiterDashboardPage from '../pages/recruiter/RecruiterDashboardPage.jsx';
import CandidateReviewPage from '../pages/recruiter/CandidateReviewPage.jsx';
import { ROLES } from '../utils/constants.js';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/candidate"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
            <CandidateDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/hardware/:interviewId"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
            <HardwareCheckPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/interview/:interviewId"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
            <InterviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/complete/:interviewId"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
            <InterviewCompletePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECRUITER, ROLES.ADMIN]}>
            <RecruiterDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/interviews/:interviewId"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECRUITER, ROLES.ADMIN]}>
            <CandidateReviewPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
