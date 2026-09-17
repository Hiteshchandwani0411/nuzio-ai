import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Splash from '../components/feedback/Splash'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Onboarding from '../pages/Onboarding'
import Home from '../pages/Home'
import './routes.css'

function PageTransition({ children }) {
  const location = useLocation()
  return (
    <div className="page-transition" key={location.pathname}>
      {children}
    </div>
  )
}

function ProtectedRoute() {
  const { isRestoring, isAuthenticated } = useAuth()

  if (isRestoring) {
    return <Splash label="Loading your account" />
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

function RequireOnboarded() {
  const { onboardingCompleted } = useAuth()

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />
  }
  return <Outlet />
}

function PublicOnlyRoute() {
  const { isRestoring, isAuthenticated, onboardingCompleted } = useAuth()

  if (isRestoring) {
    return <Splash label="Loading your account" />
  }
  if (isAuthenticated) {
    return <Navigate to={onboardingCompleted ? '/home' : '/onboarding'} replace />
  }
  return <Outlet />
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Landing />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route
          path="/onboarding"
          element={
            <PageTransition>
              <Onboarding />
            </PageTransition>
          }
        />
        <Route element={<RequireOnboarded />}>
          <Route
            path="/home"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes