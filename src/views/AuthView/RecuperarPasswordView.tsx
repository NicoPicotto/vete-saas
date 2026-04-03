import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecuperarPasswordView() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      toast.error('No se pudo enviar el email. Verificá la dirección ingresada.');
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/40 px-4'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='flex flex-col items-center gap-2 text-center'>
          <PawPrint className='h-8 w-8 text-primary' />
          <h1 className='text-2xl font-bold'>VeteVite</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recuperar contraseña</CardTitle>
            <CardDescription>
              {sent
                ? 'Revisá tu email para continuar'
                : 'Ingresá tu email y te enviamos un link para restablecer tu contraseña'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  Enviamos un link de recuperación a <strong>{email}</strong>. Revisá también la
                  carpeta de spam.
                </p>
                <Link to='/login'>
                  <Button variant='outline' className='w-full'>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Volver al inicio de sesión
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='clinica@ejemplo.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete='email'
                  />
                </div>

                <Button type='submit' className='w-full' disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar link de recuperación'}
                </Button>

                <Link
                  to='/login'
                  className='flex items-center justify-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:underline'
                >
                  <ArrowLeft className='h-3 w-3' />
                  Volver al inicio de sesión
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
