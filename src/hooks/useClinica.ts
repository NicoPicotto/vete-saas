import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ClinicaFormData } from '@/lib/types';
import { getClinica, updateClinica } from '@/services/clinica.service';

export const clinicaKeys = {
  all: ['clinica'] as const,
};

export const useClinica = () => {
  return useQuery({
    queryKey: clinicaKeys.all,
    queryFn: getClinica,
  });
};

export const useUpdateClinica = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClinicaFormData) => updateClinica(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicaKeys.all });
      toast.success('Perfil de clínica actualizado');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
