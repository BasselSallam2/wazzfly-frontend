import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Skeleton } from '@components/ui/Skeleton';
import { designTokens } from '@/config/design-tokens';
import { formatNumber } from '@lib/format/number';
import { projectStatusMap } from '@components/data-table/statusMaps';
import { EmptyState } from '@components/feedback/EmptyState';

interface Props {
  byStatus?: Record<string, number>;
  loading?: boolean;
}

const colorByStatus: Record<string, string> = {
  open: designTokens.chart.info,
  'in-progress': designTokens.chart.warning,
  completed: designTokens.chart.success,
  cancelled: designTokens.chart.neutral,
  rejected: designTokens.chart.danger,
};

export function ProjectStatusDonut({ byStatus, loading }: Props) {
  const data = byStatus
    ? Object.entries(byStatus).map(([key, value]) => ({
        name: projectStatusMap[key]?.label ?? key,
        value,
        key,
      }))
    : [];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects by status</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : total === 0 ? (
          <EmptyState icon="donut_large" title="No projects yet" description="Status data will appear here." />
        ) : (
          <div className="flex flex-col items-center gap-6 lg:flex-row">
            <div className="h-64 w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={92}
                    paddingAngle={1}
                    stroke="transparent"
                  >
                    {data.map((entry) => (
                      <Cell key={entry.key} fill={colorByStatus[entry.key] ?? designTokens.chart.neutral} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #c6c6cd',
                      backgroundColor: '#ffffff',
                      fontSize: 13,
                    }}
                    formatter={(v: number) => [formatNumber(v), 'Projects']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex flex-1 flex-col gap-2">
              {data.map((entry) => (
                <li
                  key={entry.key}
                  className="flex items-center justify-between rounded-md border border-outline-variant px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-body-md text-on-surface">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: colorByStatus[entry.key] ?? designTokens.chart.neutral }}
                    />
                    {entry.name}
                  </span>
                  <span className="tabular text-label-md font-semibold text-on-surface">
                    {formatNumber(entry.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
