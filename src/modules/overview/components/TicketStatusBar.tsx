import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Skeleton } from '@components/ui/Skeleton';
import { designTokens } from '@/config/design-tokens';
import { EmptyState } from '@components/feedback/EmptyState';

interface Props {
  byType?: Record<string, Record<string, number>>;
  byStatus?: Record<string, number>;
  loading?: boolean;
}

export function TicketStatusBar({ byType, byStatus, loading }: Props) {
  const data: { name: string; pending: number; closed: number }[] = [];

  if (byType) {
    for (const [type, statuses] of Object.entries(byType)) {
      data.push({
        name: type,
        pending: statuses.pending ?? 0,
        closed: statuses.closed ?? 0,
      });
    }
  } else if (byStatus) {
    data.push({
      name: 'Tickets',
      pending: byStatus.pending ?? 0,
      closed: byStatus.closed ?? 0,
    });
  }

  const empty = data.length === 0 || data.every((d) => d.pending + d.closed === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : empty ? (
          <EmptyState icon="bar_chart" title="No tickets to show" description="Pipeline data will appear here." />
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={6} barCategoryGap={28}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e0e3e5" vertical={false} />
                <XAxis dataKey="name" stroke="#76777d" fontSize={12} />
                <YAxis stroke="#76777d" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #c6c6cd',
                    backgroundColor: '#ffffff',
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="pending" radius={[4, 4, 0, 0]} fill={designTokens.chart.warning} />
                <Bar dataKey="closed" radius={[4, 4, 0, 0]} fill={designTokens.chart.success} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center gap-4 text-body-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: designTokens.chart.warning }} />
                Pending
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: designTokens.chart.success }} />
                Closed
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
