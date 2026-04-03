import { Settings } from 'lucide-react';
import { ClinicaForm, clinicaToFormValues } from '@/components/clinica/ClinicaForm';
import { useClinica, useUpdateClinica } from '@/hooks/useClinica';
import type { ClinicaFormValues } from '@/lib/schemas';

export default function ConfiguracionView() {
  const { data: clinica, isLoading: isLoadingClinica } = useClinica();
  const { mutate: updateClinica, isPending } = useUpdateClinica();

  function handleSubmit(data: ClinicaFormValues) {
    updateClinica(data);
  }

  if (isLoadingClinica) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p className='text-muted-foreground'>Cargando...</p>
      </div>
    );
  }

  return (
    <div className='max-w-2xl space-y-6'>
      <div className='flex items-center gap-3'>
        <Settings className='h-6 w-6 text-muted-foreground' />
        <div>
          <h1 className='text-2xl font-bold'>Configuración</h1>
          <p className='text-muted-foreground text-sm'>Perfil y apariencia de tu clínica</p>
        </div>
      </div>

      <div className='rounded-lg border bg-card p-6'>
        <ClinicaForm
          defaultValues={clinica ? clinicaToFormValues(clinica) : undefined}
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel='Guardar cambios'
        />
      </div>
    </div>
  );
}
