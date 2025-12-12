import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { ProtectedRoute } from "components/ProtectedRoute";
import { useSession } from "contexts/AuthContext";
import NotFound from "pages/NotFound";
import Unauthorized from "pages/Unauthorized";
import IntelligentDashboard from './pages/intelligent-dashboard';
import DietPlanViewer from './pages/diet-plan-viewer';
import PatientProfileBuilder from './pages/patient-profile-builder';
import FoodExplorer from './pages/food-explorer';
import ProgressAnalytics from './pages/progress-analytics';
import AIDietGenerator from './pages/ai-diet-generator';
import PatientRecords from './pages/patient-records';
import PastDiets from './pages/past-diets';
import Remedies from './pages/remedies';
import Reports from './pages/reports';
import Help from './pages/help';
import Login from './pages/login';
import Landing from './pages/landing';

// Wrapper component to restrict AI Diet Generator to non-patients
const AIDietGeneratorRoute = () => {
  const { data } = useSession();
  const userRole = data?.user?.role?.toLowerCase();
  const isPatient = userRole === 'patient';
  
  if (isPatient) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <AIDietGenerator />;
};

// Wrapper component to restrict Patient Records to practitioners only
const PatientRecordsRoute = () => {
  const { data } = useSession();
  const userRole = data?.user?.role?.toLowerCase();
  const isPractitioner = userRole === 'practitioner' || userRole === 'admin';
  
  if (!isPractitioner) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <PatientRecords />;
};

// Wrapper component to restrict Past Diets to practitioners only
const PastDietsRoute = () => {
  const { data } = useSession();
  const userRole = data?.user?.role?.toLowerCase();
  const isPractitioner = userRole === 'practitioner' || userRole === 'admin';
  
  if (!isPractitioner) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <PastDiets />;
};

// Wrapper component to restrict Remedies to patients only
const RemediesRoute = () => {
  const { data } = useSession();
  const userRole = data?.user?.role?.toLowerCase();
  const isPatient = userRole === 'patient';
  
  if (!isPatient) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Remedies />;
};

// Wrapper component to restrict Reports to practitioners only
const ReportsRoute = () => {
  const { data } = useSession();
  const userRole = data?.user?.role?.toLowerCase();
  const isPractitioner = userRole === 'practitioner' || userRole === 'admin';
  
  if (!isPractitioner) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Reports />;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route 
          path="/intelligent-dashboard" 
          element={
            <ProtectedRoute>
              <IntelligentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/diet-plan-viewer" 
          element={
            <ProtectedRoute>
              <DietPlanViewer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient-profile-builder" 
          element={
            <ProtectedRoute>
              <PatientProfileBuilder />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/food-explorer" 
          element={
            <ProtectedRoute>
              <FoodExplorer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/progress-analytics" 
          element={
            <ProtectedRoute>
              <ProgressAnalytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ai-diet-generator" 
          element={
            <ProtectedRoute>
              <AIDietGeneratorRoute />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient-records" 
          element={
            <ProtectedRoute>
              <PatientRecordsRoute />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/past-diets" 
          element={
            <ProtectedRoute>
              <PastDietsRoute />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/remedies" 
          element={
            <ProtectedRoute>
              <RemediesRoute />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <ReportsRoute />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/help" 
          element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
