import { Navigate, Outlet } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

export function SubscriptionGuard() {
  const { hasAccess, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center gap-2 text-muted-foreground'>
        <PawPrint className='h-5 w-5 animate-pulse' />
        <span className='text-sm'>Cargando...</span>
      </div>
    );
  }

  if (!hasAccess) {
    return <Navigate to='/billing' replace />;
  }

  return <Outlet />;
}
