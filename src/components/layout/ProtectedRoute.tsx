import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LoadingState } from '../ui/LoadingState'

/**
 * Пропускает только авторизованных пользователей.
 * Пока идёт проверка сессии — показывает экран загрузки.
 * Если сессии нет — редиректит на /login.
 */
export function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) return <LoadingState fullScreen />
  if (!session) return <Navigate to="/login" replace />

  return <Outlet />
}
