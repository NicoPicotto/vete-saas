import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import type { ItemPago } from '@/lib/types';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  itemsPago: ItemPago[];
}

export default function DeudaEvolucionChart({ itemsPago }: Props) {
  const data = useMemo(() => {
    const hoy = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const mes = subMonths(hoy, 5 - i);
      const inicio = startOfMonth(mes);
      const fin = endOfMonth(mes);
      const itemsMes = itemsPago.filter((ip) => ip.fecha >= inicio && ip.fecha <= fin);
      const facturado = itemsMes.reduce((acc, ip) => acc + ip.monto, 0);
      const cobrado = itemsMes.reduce((acc, ip) => acc + ip.montoPagado, 0);
      return {
        mes: format(mes, 'MMM', { locale: es }),
        facturado,
        cobrado,
      };
    });
  }, [itemsPago]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Facturado vs Cobrado
        </CardTitle>
        <CardDescription>Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradFacturado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCobrado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name === 'facturado' ? 'Facturado' : 'Cobrado',
              ]}
              labelStyle={{ fontWeight: 600 }}
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
            />
            <Legend
              formatter={(value) => (value === 'facturado' ? 'Facturado' : 'Cobrado')}
              wrapperStyle={{ fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="facturado"
              stroke="hsl(var(--primary))"
              fill="url(#gradFacturado)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="cobrado"
              stroke="#22c55e"
              fill="url(#gradCobrado)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
