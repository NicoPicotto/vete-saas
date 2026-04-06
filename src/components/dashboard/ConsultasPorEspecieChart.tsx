import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint } from 'lucide-react';
import type { HistoriaClinica, Mascota } from '@/lib/types';

const COLORS = ['hsl(var(--primary))', '#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

interface Props {
  historias: HistoriaClinica[];
  mascotas: Mascota[];
}

export default function ConsultasPorEspecieChart({ historias, mascotas }: Props) {
  const data = useMemo(() => {
    const mascotaMap = new Map(mascotas.map((m) => [m.id, m.especie]));
    const conteo: Record<string, number> = {};
    for (const h of historias) {
      const especie = mascotaMap.get(h.mascotaId) ?? 'Otro';
      conteo[especie] = (conteo[especie] ?? 0) + 1;
    }
    return Object.entries(conteo)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [historias, mascotas]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PawPrint className="h-5 w-5" />
          Consultas por Especie
        </CardTitle>
        <CardDescription>Total histórico de historia clínica</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground h-[200px] flex items-center justify-center">
            Sin consultas registradas
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{ borderRadius: 8, fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
