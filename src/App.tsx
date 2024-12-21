import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './styles/theme';
import Layout from './components/layout/Layout';
import { useAppSelector } from './store/hooks';

// Lazy load pages
const Login = React.lazy(() => import('./pages/auth/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Courses = React.lazy(() => import('./pages/courses/Courses'));
const CourseDetail = React.lazy(() => import('./pages/courses/CourseDetail'));
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Chat = React.lazy(() => import('./pages/chat/Chat'));
const Notes = React.lazy(() => import('./pages/notes/Notes'));
const Assignments = React.lazy(() => import('./pages/assignments/Assignments'));
const Grades = React.lazy(() => import('./pages/grades/Grades'));
const Students = React.lazy(() => import('./pages/Students'));
const Analytics = React.lazy(() => import('./pages/Analytics'));

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// App Routes component to use hooks
const AppRoutes: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isProfessor = user?.role === 'professor';

  return (
    <Routes>
      <Route path="/login" element={
        <React.Suspense fallback={<div>Loading...</div>}>
          <Login />
        </React.Suspense>
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </React.Suspense>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </React.Suspense>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/courses" element={
        <ProtectedRoute>
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Courses />
            </React.Suspense>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/courses/:courseId" element={
        <ProtectedRoute>
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <CourseDetail />
            </React.Suspense>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/calendar" element={
        <ProtectedRoute>
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Calendar />
            </React.Suspense>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/chat" element={
        <ProtectedRoute>
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Chat />
            </React.Suspense>
          </Layout>
        </ProtectedRoute>
      } />

      {isProfessor && (
        <>
          <Route path="/notes" element={
            <ProtectedRoute>
              <Layout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Notes />
                </React.Suspense>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/students" element={
            <ProtectedRoute>
              <Layout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Students />
                </React.Suspense>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/analytics" element={
            <ProtectedRoute>
              <Layout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Analytics />
                </React.Suspense>
              </Layout>
            </ProtectedRoute>
          } />
        </>
      )}

      <Route path="/assignments" element={
        <ProtectedRoute>
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Assignments />
            </React.Suspense>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/grades" element={
        <ProtectedRoute>
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Grades />
            </React.Suspense>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
