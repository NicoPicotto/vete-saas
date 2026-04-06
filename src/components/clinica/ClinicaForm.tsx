import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clinicaSchema, type ClinicaFormValues } from '@/lib/schemas';
import type { Clinica } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ============================================
// COLOR PICKER INPUT
// ============================================

interface ColorPickerInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
}

// Convierte cualquier HEX válido a 6 dígitos para el input nativo.
// El input[type=color] solo acepta #RRGGBB — no admite 3 dígitos ni vacío.
function toSixDigitHex(value: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) return value;
  if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
    const [, r, g, b] = value.split('');
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return '#000000'; // Fallback visual cuando el campo está vacío
}

function ColorPickerInput({ value, onChange, id, placeholder }: ColorPickerInputProps) {
  const safeColorValue = toSixDigitHex(value ?? '');
  const hasValue = /^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/.test(value ?? '');

  return (
    <div className='flex items-center gap-2'>
      {/* Swatch nativo — abre el color picker del navegador */}
      <div className='relative shrink-0'>
        <input
          type='color'
          value={safeColorValue}
          onChange={(e) => onChange(e.target.value)}
          className='absolute inset-0 opacity-0 cursor-pointer w-full h-full'
          tabIndex={-1}
        />
        <div
          className='h-9 w-9 rounded-md border border-input cursor-pointer transition-shadow hover:shadow-md'
          style={{ backgroundColor: hasValue ? safeColorValue : undefined }}
          title='Abrir selector de color'
        />
      </div>

      {/* Input de texto para HEX manual */}
      <Input
        id={id}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? '#000000'}
        className='font-mono'
        maxLength={7}
      />
    </div>
  );
}

// ============================================
// CLINICA FORM
// ============================================

interface ClinicaFormProps {
  defaultValues?: Partial<ClinicaFormValues>;
  onSubmit: (data: ClinicaFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function ClinicaForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Guardar' }: ClinicaFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClinicaFormValues>({
    resolver: zodResolver(clinicaSchema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Información general */}
      <div className='space-y-4'>
        <h3 className='text-sm font-medium text-muted-foreground uppercase tracking-wide'>
          Información general
        </h3>

        <div className='space-y-2'>
          <Label htmlFor='nombre'>Nombre de la clínica *</Label>
          <Input id='nombre' placeholder='Ej: Clínica Veterinaria San Martín' {...register('nombre')} />
          {errors.nombre && <p className='text-sm text-destructive'>{errors.nombre.message}</p>}
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='telefono'>Teléfono</Label>
            <Input id='telefono' placeholder='Ej: +54 11 1234-5678' {...register('telefono')} />
            {errors.telefono && <p className='text-sm text-destructive'>{errors.telefono.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='direccion'>Dirección</Label>
            <Input id='direccion' placeholder='Ej: Av. Corrientes 1234, CABA' {...register('direccion')} />
            {errors.direccion && <p className='text-sm text-destructive'>{errors.direccion.message}</p>}
          </div>
        </div>
      </div>

      {/* Color de marca */}
      <div className='space-y-4'>
        <h3 className='text-sm font-medium text-muted-foreground uppercase tracking-wide'>
          Color de la marca
        </h3>
        <p className='text-sm text-muted-foreground'>
          Este color se aplica en botones y elementos activos. Dejá en blanco para usar el color por defecto.
        </p>

        <div className='space-y-2'>
          <Label htmlFor='colorPrimario'>Color de la marca</Label>
          <p className='text-xs text-muted-foreground'>Botones y elementos activos</p>
          <Controller
            name='colorPrimario'
            control={control}
            render={({ field }) => (
              <ColorPickerInput
                id='colorPrimario'
                value={field.value ?? ''}
                onChange={field.onChange}
                placeholder='#0a2237'
              />
            )}
          />
          {errors.colorPrimario && (
            <p className='text-sm text-destructive'>{errors.colorPrimario.message}</p>
          )}
        </div>
      </div>

      <Button type='submit' disabled={isLoading} className='w-full sm:w-auto'>
        {isLoading ? 'Guardando...' : submitLabel}
      </Button>
    </form>
  );
}

// Helper para convertir Clinica → defaultValues del formulario
export function clinicaToFormValues(clinica: Clinica): Partial<ClinicaFormValues> {
  return {
    nombre: clinica.nombre ?? '',
    telefono: clinica.telefono ?? '',
    direccion: clinica.direccion ?? '',
    colorPrimario: clinica.colorPrimario ?? '',
  };
}
