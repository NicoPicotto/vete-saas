import { supabase, getUserId } from '@/lib/supabase';

// Tipos permitidos: PDF e imágenes
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB en bytes
const SIGNED_URL_EXPIRY = 3600; // 1 hora en segundos

export interface ArchivoSubido {
  nombre: string;
  url: string;
  tipo: string;
  tamano: number;
}

/**
 * Subir archivo a Supabase Storage (bucket privado).
 * Path: {user_id}/{historia_clinica_id}/{timestamp}_{filename}
 * La URL retornada es una signed URL válida por 1 hora.
 */
export const uploadArchivoHistoriaClinica = async (
  historiaClinicaId: string,
  file: File
): Promise<ArchivoSubido> => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('El archivo no puede superar 5 MB');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Solo se permiten archivos PDF o imágenes (JPG, PNG)');
  }

  const userId = await getUserId();
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const path = `${userId}/${historiaClinicaId}/${fileName}`;

  const { error } = await supabase.storage
    .from('historia-clinica')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Error al subir archivo: ${error.message}`);
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from('historia-clinica')
    .createSignedUrl(path, SIGNED_URL_EXPIRY);

  if (signedError || !signedData) {
    throw new Error(`Error al generar URL del archivo: ${signedError?.message}`);
  }

  return {
    nombre: file.name,
    url: path, // Guardamos el PATH en DB, no la URL firmada (que expira)
    tipo: file.type,
    tamano: file.size,
  };
};

/**
 * Obtener una signed URL válida por 1 hora para un archivo.
 * Usar esta función al mostrar archivos (la URL en DB es el path, no la URL).
 */
export const getSignedUrl = async (path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('historia-clinica')
    .createSignedUrl(path, SIGNED_URL_EXPIRY);

  if (error || !data) {
    throw new Error(`Error al obtener URL del archivo: ${error?.message}`);
  }

  return data.signedUrl;
};

/**
 * Eliminar archivo de Supabase Storage por su path.
 */
export const deleteArchivoHistoriaClinica = async (
  archivoPath: string
): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from('historia-clinica')
      .remove([archivoPath]);

    if (error) {
      console.error('Error al eliminar archivo:', error.message);
    }
  } catch (err) {
    console.error('Error al procesar eliminación de archivo:', err);
  }
};

/**
 * Eliminar todos los archivos de una consulta.
 * Útil al eliminar la consulta completa.
 */
export const deleteAllArchivosHistoriaClinica = async (
  userId: string,
  historiaClinicaId: string
): Promise<void> => {
  try {
    const folderPath = `${userId}/${historiaClinicaId}`;

    const { data: files, error: listError } = await supabase.storage
      .from('historia-clinica')
      .list(folderPath);

    if (listError) {
      console.error('Error al listar archivos:', listError.message);
      return;
    }

    if (!files || files.length === 0) return;

    const filePaths = files.map((file) => `${folderPath}/${file.name}`);

    const { error: deleteError } = await supabase.storage
      .from('historia-clinica')
      .remove(filePaths);

    if (deleteError) {
      console.error('Error al eliminar archivos:', deleteError.message);
    }
  } catch (err) {
    console.error('Error al procesar eliminación de archivos:', err);
  }
};
