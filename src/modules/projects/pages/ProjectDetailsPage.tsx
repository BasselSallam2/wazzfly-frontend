import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Avatar } from '@components/ui/Avatar';
import { Icon } from '@components/ui/Icon';
import { LoadingState } from '@components/feedback/LoadingState';
import { ErrorState } from '@components/feedback/ErrorState';
import { ConfirmDialog } from '@components/feedback/ConfirmDialog';
import { EmptyState } from '@components/feedback/EmptyState';
import { RefundProjectDialog } from '../components/RefundProjectDialog';
import { projectsApi } from '../api/projects.api';
import { projectStatusMap } from '@components/data-table/statusMaps';
import { formatCurrency } from '@lib/format/currency';
import { formatDateTime } from '@lib/format/date';
import { QUERY_KEYS, ROUTES } from '@/config/constants';
import { toast } from '@components/ui/Toast';
import { isApiError } from '@lib/api/errors';
import type { User } from '@/types';

function asUser(v: string | User | null | undefined): User | null {
  return typeof v === 'object' && v ? v : null;
}

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [refundOpen, setRefundOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const projectQuery = useQuery({
    queryKey: [QUERY_KEYS.projects.detail, id],
    queryFn: () =>
      projectsApi.get(id!, {
        populate: [
          { path: 'client', select: 'name email avatar' },
          { path: 'freelancer', select: 'name email avatar' },
        ],
      }),
    enabled: Boolean(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => projectsApi.remove(id!),
    onSuccess: () => {
      toast.success('Project deleted');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects.list] });
      navigate(ROUTES.projects);
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Failed to delete'),
  });

  if (projectQuery.isLoading) return <LoadingState />;
  if (projectQuery.isError)
    return <ErrorState error={projectQuery.error} onRetry={() => projectQuery.refetch()} />;
  if (!projectQuery.data) return <EmptyState icon="folder_off" title="Project not found" />;

  const project = projectQuery.data;
  const client = asUser(project.client);
  const freelancer = asUser(project.freelancer);
  const statusMeta = projectStatusMap[project.status] ?? {
    label: project.status,
    tone: 'neutral' as const,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={project.title}
        description={project.description}
        actions={
          <>
            <Button variant="secondary" iconLeft="arrow_back" onClick={() => navigate(ROUTES.projects)}>
              Back
            </Button>
            <Button variant="danger" iconLeft="undo" onClick={() => setRefundOpen(true)}>
              Refund
            </Button>
            <Button variant="ghost" iconLeft="delete" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Status & money</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge tone={statusMeta.tone} dot>
              {statusMeta.label}
            </Badge>
            <dl className="grid grid-cols-2 gap-3 text-body-md">
              <div>
                <dt className="text-label-sm uppercase text-on-surface-variant">Budget</dt>
                <dd className="mt-0.5 text-h2 font-semibold tabular text-on-surface">
                  {formatCurrency(project.Budget)}
                </dd>
              </div>
              <div>
                <dt className="text-label-sm uppercase text-on-surface-variant">Paid</dt>
                <dd className="mt-0.5 tabular text-on-surface">{formatCurrency(project.paid ?? 0)}</dd>
              </div>
              <div>
                <dt className="text-label-sm uppercase text-on-surface-variant">Refunded</dt>
                <dd className="mt-0.5 tabular text-error">{formatCurrency(project.refunded ?? 0)}</dd>
              </div>
              <div>
                <dt className="text-label-sm uppercase text-on-surface-variant">Deadline</dt>
                <dd className="mt-0.5 text-on-surface">{formatDateTime(project.deadline)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent>
            {client ? (
              <div className="flex items-center gap-3">
                <Avatar name={client.name} src={client.avatar} size="md" />
                <div>
                  <p className="text-label-md font-medium text-on-surface">{client.name}</p>
                  <p className="text-body-sm text-on-surface-variant">{client.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-on-surface-variant">No client info</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Freelancer</CardTitle>
          </CardHeader>
          <CardContent>
            {freelancer ? (
              <div className="flex items-center gap-3">
                <Avatar name={freelancer.name} src={freelancer.avatar} size="md" />
                <div>
                  <p className="text-label-md font-medium text-on-surface">{freelancer.name}</p>
                  <p className="text-body-sm text-on-surface-variant">{freelancer.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-on-surface-variant">Unassigned</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          {(project.milestones?.length ?? 0) === 0 ? (
            <EmptyState icon="checklist" title="No milestones for this project." />
          ) : (
            <ol className="flex flex-col gap-3">
              {project.milestones!.map((m, idx) => (
                <li
                  key={m._id ?? idx}
                  className="flex items-start justify-between gap-4 rounded-lg border border-outline-variant p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container text-label-md font-semibold">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-label-md font-medium text-on-surface">{m.title}</p>
                      {m.description ? (
                        <p className="mt-0.5 text-body-sm text-on-surface-variant">{m.description}</p>
                      ) : null}
                      <div className="mt-2 flex items-center gap-3 text-body-sm text-on-surface-variant">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="event" size={14} />
                          {m.dueDate ? formatDateTime(m.dueDate) : 'No due date'}
                        </span>
                        <span className="capitalize">{m.status}</span>
                      </div>
                    </div>
                  </div>
                  <span className="tabular text-label-md font-semibold text-on-surface">
                    {formatCurrency(m.amount)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      <RefundProjectDialog open={refundOpen} onOpenChange={setRefundOpen} project={project} />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete project?"
        description="This is permanent. Consider refund/cancel first."
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}
