import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validación para asegurarnos de que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan variables de entorno de Supabase. Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Obtiene el ID del usuario autenticado actual.
 * Lanza error si no hay sesión activa.
 */
export const getUserId = async (): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No hay sesión activa');
  return session.user.id;
};
