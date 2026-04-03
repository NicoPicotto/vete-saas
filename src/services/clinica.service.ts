import { supabase, getUserId } from '@/lib/supabase';
import type { Clinica, ClinicaFormData } from '@/lib/types';

interface ClinicaDB {
  id: string;
  nombre: string | null;
  direccion: string | null;
  telefono: string | null;
  color_primario: string | null;
  color_secundario: string | null;
  color_acento: string | null;
  onboarding_completado: boolean;
}

const dbToClinica = (db: ClinicaDB): Clinica => ({
  id: db.id,
  nombre: db.nombre || undefined,
  direccion: db.direccion || undefined,
  telefono: db.telefono || undefined,
  colorPrimario: db.color_primario || undefined,
  colorSecundario: db.color_secundario || undefined,
  colorAcento: db.color_acento || undefined,
  onboardingCompletado: db.onboarding_completado,
});

/**
 * Obtener el perfil de la clínica del usuario autenticado.
 */
export const getClinica = async (): Promise<Clinica> => {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from('clinicas')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(`Error al obtener perfil de clínica: ${error.message}`);
  }

  return dbToClinica(data as ClinicaDB);
};

/**
 * Actualizar el perfil de la clínica.
 * Si es el primer guardado (onboarding), marca onboarding_completado = true.
 */
export const updateClinica = async (formData: ClinicaFormData): Promise<Clinica> => {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from('clinicas')
    .update({
      nombre: formData.nombre || null,
      direccion: formData.direccion || null,
      telefono: formData.telefono || null,
      color_primario: formData.colorPrimario || null,
      color_secundario: formData.colorSecundario || null,
      color_acento: formData.colorAcento || null,
      onboarding_completado: true,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar perfil de clínica: ${error.message}`);
  }

  return dbToClinica(data as ClinicaDB);
};
