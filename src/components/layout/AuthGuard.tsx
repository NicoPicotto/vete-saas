import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PawPrint } from 'lucide-react';

export function AuthGuard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center gap-2 text-muted-foreground'>
        <PawPrint className='h-5 w-5 animate-pulse' />
        <span className='text-sm'>Cargando...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
}
