import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import { StoreContext, rootStore } from './store/mob/RootStore';
import theme from './styles/theme';
import Layout from './components/layout/Layout';
import { useAuthStore } from './store/mob/RootStore';

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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const AppRoutes = () => {
    const authStore = useAuthStore();
    const isProfessor = authStore.user?.role === 'professor';

    return (
        <Routes>
            <Route path="/login" element={
                <React.Suspense fallback={<div>Loading...</div>}>
                    <Login />
                </React.Suspense>
            } />

            <Route path="/" element={
                    <Layout>
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <Dashboard />
                        </React.Suspense>
                    </Layout>
            } />

            <Route path="/dashboard" element={
                    <Layout>
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <Dashboard />
                        </React.Suspense>
                    </Layout>
            } />

            <Route path="/courses" element={
                    <Layout>
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <Courses />
                        </React.Suspense>
                    </Layout>
            } />

            <Route path="/courses/:courseId" element={
                    <Layout>
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <CourseDetail />
                        </React.Suspense>
                    </Layout>
            } />

            <Route path="/calendar" element={
                    <Layout>
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <Calendar />
                        </React.Suspense>
                    </Layout>
            } />

            <Route path="/chat" element={
                    <Layout>
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <Chat />
                        </React.Suspense>
                    </Layout>
            } />

            {isProfessor && (
                <>
                    <Route path="/notes" element={
                            <Layout>
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <Notes />
                                </React.Suspense>
                            </Layout>
                    } />

                    <Route path="/students" element={
                            <Layout>
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <Students />
                                </React.Suspense>
                            </Layout>
                    } />

                    <Route path="/analytics" element={
                            <Layout>
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <Analytics />
                                </React.Suspense>
                            </Layout>
                    } />
                </>
            )}

            <Route path="/assignments" element={
                    <Layout>
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <Assignments />
                        </React.Suspense>
                    </Layout>
            } />

            <Route path="/grades" element={
                    <Layout>
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <Grades />
                        </React.Suspense>
                    </Layout>
            } />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

const App = observer(() => {
    return (
        <StoreContext.Provider value={rootStore}>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </ThemeProvider>
        </StoreContext.Provider>
    );
});

export default App as React.FC;