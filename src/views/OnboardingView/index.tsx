import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { ClinicaForm } from '@/components/clinica/ClinicaForm';
import { useUpdateClinica } from '@/hooks/useClinica';
import type { ClinicaFormValues } from '@/lib/schemas';

export default function OnboardingView() {
  const navigate = useNavigate();
  const { mutate: updateClinica, isPending } = useUpdateClinica();

  function handleSubmit(data: ClinicaFormValues) {
    updateClinica(data, {
      onSuccess: () => navigate('/', { replace: true }),
    });
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-lg space-y-8'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <div className='flex justify-center'>
            <div className='rounded-full bg-primary/10 p-3'>
              <PawPrint className='h-8 w-8 text-primary' />
            </div>
          </div>
          <h1 className='text-2xl font-bold'>¡Bienvenido!</h1>
          <p className='text-muted-foreground'>
            Antes de empezar, completá los datos de tu clínica. Podrás editarlos después desde Configuración.
          </p>
        </div>

        {/* Formulario */}
        <div className='rounded-lg border bg-card p-6 shadow-sm'>
          <ClinicaForm
            onSubmit={handleSubmit}
            isLoading={isPending}
            submitLabel='Comenzar a usar VeteVite'
          />
        </div>
      </div>
    </div>
  );
}
