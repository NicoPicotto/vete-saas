import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterView() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirm) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    navigate('/onboarding', { replace: true });
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/40 px-4'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='flex flex-col items-center gap-2 text-center'>
          <PawPrint className='h-8 w-8 text-primary' />
          <h1 className='text-2xl font-bold'>VeteVite</h1>
          <p className='text-sm text-muted-foreground'>Empezá tu prueba gratuita de 14 días</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear cuenta</CardTitle>
            <CardDescription>Sin tarjeta de crédito requerida</CardDescription>
          </CardHeader>
          <CardContent>
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

              <div className='space-y-2'>
                <Label htmlFor='password'>Contraseña</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete='new-password'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirm'>Confirmar contraseña</Label>
                <Input
                  id='confirm'
                  type='password'
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete='new-password'
                />
              </div>

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Empezar prueba gratuita'}
              </Button>

              <p className='text-center text-sm text-muted-foreground'>
                ¿Ya tenés cuenta?{' '}
                <Link to='/login' className='underline-offset-4 hover:underline'>
                  Iniciá sesión
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
