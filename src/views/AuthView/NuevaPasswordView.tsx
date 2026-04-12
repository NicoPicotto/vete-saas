import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NuevaPasswordView() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
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
    const { error } = await updatePassword(password);

    if (error) {
      toast.error('No se pudo actualizar la contraseña. Intentá solicitar un nuevo link.');
      setLoading(false);
      return;
    }

    toast.success('Contraseña actualizada correctamente.');
    navigate('/login', { replace: true });
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
            <CardTitle>Nueva contraseña</CardTitle>
            <CardDescription>Ingresá tu nueva contraseña para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='password'>Nueva contraseña</Label>
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
                {loading ? 'Guardando...' : 'Guardar contraseña'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
