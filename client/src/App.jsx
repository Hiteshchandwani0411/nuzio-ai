import { AuthProvider } from './features/auth/AuthContext'
import { ToastProvider } from './components/feedback'
import AppRoutes from './routes'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  )
}

export default App