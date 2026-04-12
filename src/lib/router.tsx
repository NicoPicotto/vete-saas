import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { SubscriptionGuard } from '@/components/layout/SubscriptionGuard';
import LoginView from '@/views/AuthView/LoginView';
import RecuperarPasswordView from '@/views/AuthView/RecuperarPasswordView';
import NuevaPasswordView from '@/views/AuthView/NuevaPasswordView';
import RegisterView from '@/views/AuthView/RegisterView';
import OnboardingView from '@/views/OnboardingView';
import BillingView from '@/views/BillingView';
import DashboardView from '@/views/DashboardView';
import ClientesView from '@/views/ClientesView';
import ClienteDetail from '@/views/ClientesView/ClienteDetail';
import MascotasView from '@/views/MascotasView';
import MascotaDetail from '@/views/MascotasView/MascotaDetail';
import PagosView from '@/views/PagosView';
import RecordatoriosView from '@/views/RecordatoriosView';
import TurnosView from '@/views/TurnosView';
import ProductosView from '@/views/ProductosView';
import VentasView from '@/views/VentasView';
import NuevaVenta from '@/views/VentasView/NuevaVenta';
import VentaDetail from '@/views/VentasView/VentaDetail';
import ConfiguracionView from '@/views/ConfiguracionView';

export const router = createBrowserRouter([
  // Rutas públicas
  { path: '/login', element: <LoginView /> },
  { path: '/register', element: <RegisterView /> },
  { path: '/recuperar-password', element: <RecuperarPasswordView /> },
  { path: '/nueva-password', element: <NuevaPasswordView /> },
  // Rutas protegidas (requieren auth)
  {
    element: <AuthGuard />,
    children: [
      // Fuera del AppLayout (sin sidebar)
      { path: '/onboarding', element: <OnboardingView /> },
      { path: '/billing', element: <BillingView /> },
      // App principal — requiere suscripción activa
      {
        element: <SubscriptionGuard />,
        children: [
          {
            path: '/',
            element: <AppLayout />,
            children: [
              { index: true, element: <DashboardView /> },
              { path: 'clientes', element: <ClientesView /> },
              { path: 'clientes/:id', element: <ClienteDetail /> },
              { path: 'mascotas', element: <MascotasView /> },
              { path: 'mascotas/:id', element: <MascotaDetail /> },
              { path: 'pagos', element: <PagosView /> },
              { path: 'recordatorios', element: <RecordatoriosView /> },
              { path: 'turnos', element: <TurnosView /> },
              { path: 'productos', element: <ProductosView /> },
              { path: 'ventas', element: <VentasView /> },
              { path: 'ventas/nueva', element: <NuevaVenta /> },
              { path: 'ventas/:id', element: <VentaDetail /> },
              { path: 'configuracion', element: <ConfiguracionView /> },
            ],
          },
        ],
      },
    ],
  },
]);
