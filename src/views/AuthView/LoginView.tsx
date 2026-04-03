import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginView() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error('Credenciales incorrectas. Verificá tu email y contraseña.');
      setLoading(false);
      return;
    }

    navigate('/', { replace: true });
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/40 px-4'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='flex flex-col items-center gap-2 text-center'>
          <PawPrint className='h-8 w-8 text-primary' />
          <h1 className='text-2xl font-bold'>VeteVite</h1>
          <p className='text-sm text-muted-foreground'>Sistema de gestión veterinaria</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>Ingresá con tu email y contraseña</CardDescription>
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
                <div className='flex items-center justify-between'>
                  <Label htmlFor='password'>Contraseña</Label>
                  <Link
                    to='/recuperar-password'
                    className='text-xs text-muted-foreground underline-offset-4 hover:underline'
                  >
                    Olvidé mi contraseña
                  </Link>
                </div>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete='current-password'
                />
              </div>

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
