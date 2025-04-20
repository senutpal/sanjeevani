
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import OpdQueuePage from "./pages/OpdQueuePage";
import BedAvailabilityPage from "./pages/BedAvailabilityPage";
import InventoryPage from "./pages/InventoryPage";
import OpdPredictionPage from "./pages/OpdPredictionPage";
import AdmissionsPage from "./pages/AdmissionsPage";
import DoctorVisitPage from "./pages/DoctorVisitPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import { useState } from "react";

// EMR Pages
import EmrDashboardPage from "./pages/EMR/EmrDashboardPage";
import PatientsListPage from "./pages/EMR/PatientsListPage";
import PatientDetailPage from "./pages/EMR/PatientDetailPage";

const App = () => {
  // Create a new QueryClient instance within the component 
  // to ensure it's created in React's render context
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Auth Page (Public) */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Dashboard - Admin, Doctor, Nurse */}
              <Route path="/" element={
                <ProtectedRoute feature="dashboard">
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* OPD Queue - Admin, Doctor, Nurse */}
              <Route path="/opd-queue" element={
                <ProtectedRoute feature="opdQueue">
                  <Layout>
                    <OpdQueuePage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Bed Availability - Admin, Nurse */}
              <Route path="/bed-availability" element={
                <ProtectedRoute feature="bedAvailability">
                  <Layout>
                    <BedAvailabilityPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Inventory - Admin only */}
              <Route path="/inventory" element={
                <ProtectedRoute feature="inventory">
                  <Layout>
                    <InventoryPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* OPD Prediction - Admin, Doctor */}
              <Route path="/opd-prediction" element={
                <ProtectedRoute feature="opdPrediction">
                  <Layout>
                    <OpdPredictionPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Admissions - Admin, Doctor, Nurse */}
              <Route path="/admissions" element={
                <ProtectedRoute feature="admissions">
                  <Layout>
                    <AdmissionsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Doctor Visit - All users */}
              <Route path="/doctor-visit" element={
                <ProtectedRoute feature="doctorVisit">
                  <Layout>
                    <DoctorVisitPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Settings - All users */}
              <Route path="/settings" element={
                <ProtectedRoute feature="settings">
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* EMR Module Routes */}
              <Route path="/emr" element={
                <ProtectedRoute feature="doctorVisit">
                  <Layout>
                    <EmrDashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/emr/patients" element={
                <ProtectedRoute feature="doctorVisit">
                  <Layout>
                    <PatientsListPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/emr/patients/:id" element={
                <ProtectedRoute feature="doctorVisit">
                  <Layout>
                    <PatientDetailPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Fallback routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
