import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import type { Venta } from '@/lib/types';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  ventas: Venta[];
}

export default function VentasPorMesChart({ ventas }: Props) {
  const data = useMemo(() => {
    const hoy = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const mes = subMonths(hoy, 5 - i);
      const inicio = startOfMonth(mes);
      const fin = endOfMonth(mes);
      const total = ventas
        .filter((v) => v.fecha >= inicio && v.fecha <= fin)
        .reduce((acc, v) => acc + v.total, 0);
      return {
        mes: format(mes, 'MMM', { locale: es }),
        total,
      };
    });
  }, [ventas]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Ventas por Mes
        </CardTitle>
        <CardDescription>Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={40}
            />
            <Tooltip
              formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Total']}
              labelStyle={{ fontWeight: 600 }}
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
