import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useClinica } from '@/hooks/useClinica';

const root = document.documentElement;

const HEX6_RE = /^#[0-9A-Fa-f]{6}$/;

function applyColor(variable: string, value?: string) {
  if (value && HEX6_RE.test(value)) {
    root.style.setProperty(variable, value);
  } else {
    root.style.removeProperty(variable);
  }
}

// Convierte un HEX de 6 dígitos a rgba con la opacidad indicada.
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function AppLayout() {
  const navigate = useNavigate();
  const { data: clinica, isLoading } = useClinica();

  useEffect(() => {
    if (!isLoading && clinica && !clinica.onboardingCompletado) {
      navigate('/onboarding', { replace: true });
    }
  }, [clinica, isLoading, navigate]);

  useEffect(() => {
    if (!clinica) return;

    // colorPrimario → botones y active states
    applyColor('--primary', clinica.colorPrimario);

    // colorSecundario → sidebar con 55% de opacidad (texto del menú legible)
    if (clinica.colorSecundario && HEX6_RE.test(clinica.colorSecundario)) {
      root.style.setProperty('--sidebar', hexToRgba(clinica.colorSecundario, 0.55));
    } else {
      root.style.removeProperty('--sidebar');
    }

    // colorAcento → fondo general de la app
    applyColor('--background', clinica.colorAcento);
  }, [clinica]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center h-14 px-4 border-b gap-2">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
