import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import DoctorLayout from './components/layout/DoctorLayout';
import PatientLayout from './components/layout/PatientLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPatients from './pages/admin/AdminPatients';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminSchedules from './pages/admin/AdminSchedules';
import AdminAppointments from './pages/admin/AdminAppointments';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import PatientHistory from './pages/doctor/PatientHistory';
import PatientHome from './pages/patient/PatientHome';
import Register from './pages/Register';
import DoctorDetail from './pages/DoctorDetail';
import DoctorsList from './pages/DoctorsList';
import News from './pages/News';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/news" element={<News />} />
          <Route path="/doctor/:id" element={<DoctorDetail />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="departments" element={<AdminDepartments />} />
            <Route path="schedules" element={<AdminSchedules />} />
            <Route path="appointments" element={<AdminAppointments />} />
          </Route>

          {/* Doctor Routes */}
          <Route 
            path="/doctor" 
            element={
              <ProtectedRoute allowedRoles={['Doctor']}>
                <DoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/doctor/dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patient/:id" element={<PatientHistory />} />
          </Route>

          {/* Patient Routes */}
          <Route 
            path="/patient" 
            element={
              <ProtectedRoute allowedRoles={['Patient']}>
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/patient/home" replace />} />
            <Route path="home" element={<PatientHome />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
