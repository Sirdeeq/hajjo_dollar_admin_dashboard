import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminBlogs from './pages/AdminBlogs';
import AdminAcademy from './pages/AdminAcademy';
import AdminInquiries from './pages/AdminInquiries';
import AdminSettings from './pages/AdminSettings';
import AdminPayments from './pages/AdminPayments';
import AdminStudentProfile from './pages/AdminStudentProfile';

function App() {
  return (
    <AdminProvider>
      <ThemeProvider>
        <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes wrapped in AdminLayout */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blogs" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminBlogs />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/academy" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminAcademy />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/academy/student/:userId" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminStudentProfile />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payments" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminPayments />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inquiries" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminInquiries />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
        </Router>
      </ThemeProvider>
    </AdminProvider>
  );
}

export default App;
