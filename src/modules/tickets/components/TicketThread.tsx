import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@components/ui/Button';
import { Textarea } from '@components/ui/Textarea';
import { Badge } from '@components/ui/Badge';
import { Avatar } from '@components/ui/Avatar';
import { Icon } from '@components/ui/Icon';
import { ConfirmDialog } from '@components/feedback/ConfirmDialog';
import { ResultBanner } from '@components/feedback/ResultBanner';
import { ticketStatusMap, ticketTypeMap } from '@components/data-table/statusMaps';
import { formatDateTime, formatRelative } from '@lib/format/date';
import { ticketsApi, type AddMessagePayload, type CloseTicketPayload } from '../api/tickets.api';
import { uploadsApi } from '@modules/uploads/api/uploads.api';
import { QUERY_KEYS } from '@/config/constants';
import { toast } from '@components/ui/Toast';
import { isApiError } from '@lib/api/errors';
import { useCurrentUser } from '@lib/auth/useCurrentUser';
import { Modal } from '@components/ui/Modal';
import { FormField } from '@components/forms/FormField';
import { resolveMediaUrl } from '@lib/urls/resolveMediaUrl';
import type { Ticket, TicketMessage, User } from '@/types';

interface TicketThreadProps {
  ticket: Ticket;
}

function asUser(value: string | User | null | undefined): User | null {
  return typeof value === 'object' && value ? value : null;
}

function getId(value: string | User | null | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === 'string' ? value : value._id;
}

/**
 * In the admin app: support messages on the right, customer on the left.
 * Prefer `senderRole` from the API; fall back to comparing sender id with the current admin.
 */
function isOutgoingMessage(
  m: TicketMessage,
  me: User | null | undefined,
  ticketUser: User | null,
): boolean {
  if (m.senderRole === 'admin') return true;
  if (m.senderRole === 'user') return false;
  const senderId = getId(m.sender);
  if (me?._id && senderId && senderId === me._id) return true;
  const customerId = getId(ticketUser ?? undefined);
  if (customerId && senderId && senderId === customerId) return false;
  return false;
}

export function TicketThread({ ticket }: TicketThreadProps) {
  const queryClient = useQueryClient();
  const me = useCurrentUser();
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [closeOpen, setCloseOpen] = useState(false);
  const [closeAction, setCloseAction] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [ticket._id, ticket.messages?.length]);

  const sendMutation = useMutation({
    mutationFn: async () => {
      let uploadedUrls: string[] = [];
      if (files.length === 1) {
        const u = await uploadsApi.single(files[0]!);
        uploadedUrls = [u.url];
      } else if (files.length > 1) {
        const u = await uploadsApi.many(files);
        uploadedUrls = u.map((f) => f.url);
      }
      const payload: AddMessagePayload = {
        ticketId: ticket._id,
        text: text.trim(),
        ...(uploadedUrls.length ? { attachments: uploadedUrls } : {}),
      };
      return ticketsApi.addMessage(payload);
    },
    onSuccess: () => {
      setText('');
      setFiles([]);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tickets.detail, ticket._id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tickets.list] });
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Failed to send message'),
  });

  const closeMutation = useMutation({
    mutationFn: () => {
      const payload: CloseTicketPayload = { ticketId: ticket._id, action: closeAction };
      return ticketsApi.close(payload);
    },
    onSuccess: () => {
      toast.success('Ticket closed');
      setCloseOpen(false);
      setCloseAction('');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tickets.detail, ticket._id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tickets.list] });
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Failed to close'),
  });

  const statusMeta = ticketStatusMap[ticket.status] ?? {
    label: ticket.status,
    tone: 'neutral' as const,
  };
  const typeMeta = ticketTypeMap[ticket.type] ?? {
    label: ticket.type,
    tone: 'neutral' as const,
  };
  const ticketOwner = asUser(ticket.user);
  const isClosed = ticket.status === 'closed';

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-outline-variant p-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone={typeMeta.tone}>{typeMeta.label}</Badge>
            <Badge tone={statusMeta.tone} dot>
              {statusMeta.label}
            </Badge>
          </div>
          <h2 className="mt-1 text-h2 font-semibold text-on-surface">{ticket.title}</h2>
          <p className="text-body-md text-on-surface-variant">{ticket.description}</p>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            From {ticketOwner?.name ?? 'Unknown'} · {formatDateTime(ticket.createdAt)}
          </p>
        </div>
        {!isClosed ? (
          <Button variant="secondary" iconLeft="task_alt" onClick={() => setCloseOpen(true)}>
            Close ticket
          </Button>
        ) : (
          <Badge tone="neutral">Closed {formatRelative(ticket.closedAt)}</Badge>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
        {(ticket.messages?.length ?? 0) === 0 ? (
          <p className="text-center text-body-md text-on-surface-variant">No messages yet</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {ticket.messages!.map((m, idx) => {
              const sender = asUser(m.sender);
              const outgoing = isOutgoingMessage(m, me, ticketOwner);
              const avatarSrc = resolveMediaUrl(sender?.avatar);
              return (
                <li
                  key={m._id ?? idx}
                  className={`flex w-full ${outgoing ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[min(100%,32rem)] gap-2 ${outgoing ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <Avatar
                      name={sender?.name ?? (outgoing ? 'Admin' : 'User')}
                      src={avatarSrc}
                      size="sm"
                      className="mt-0.5 shrink-0"
                    />
                    <div
                      className={`min-w-0 max-w-full rounded-2xl px-3 py-2 ${
                        outgoing
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-left text-body-md">{m.text}</p>
                      {m.attachments?.length ? (
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {m.attachments.map((url) => (
                            <li key={url}>
                              <a
                                href={resolveMediaUrl(url) ?? url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-body-sm underline ${
                                  outgoing
                                    ? 'bg-on-primary/15 text-on-primary'
                                    : 'bg-surface-container-low text-on-surface'
                                }`}
                              >
                                <Icon name="attach_file" size={14} />
                                attachment
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <p
                        className={`mt-1 text-left text-body-sm ${
                          outgoing ? 'text-on-primary/80' : 'text-on-surface-variant'
                        }`}
                      >
                        {formatRelative(m.createdAt)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {!isClosed ? (
        <div className="border-t border-outline-variant p-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your reply…"
            rows={3}
          />
          {files.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {files.map((f) => (
                <li
                  key={f.name}
                  className="flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1 text-body-sm"
                >
                  <Icon name="attach_file" size={14} />
                  {f.name}
                  <button
                    onClick={() => setFiles((cur) => cur.filter((x) => x !== f))}
                    className="ml-1 text-on-surface-variant hover:text-error"
                    aria-label="Remove file"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-3 flex items-center justify-between">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files) {
                  setFiles((cur) => [...cur, ...Array.from(e.target.files!)]);
                  e.target.value = '';
                }
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              iconLeft="attach_file"
              onClick={() => fileInputRef.current?.click()}
            >
              Attach
            </Button>
            <Button
              iconRight="send"
              loading={sendMutation.isPending}
              disabled={!text.trim()}
              onClick={() => sendMutation.mutate()}
            >
              Reply
            </Button>
          </div>
        </div>
      ) : null}

      <Modal
        open={closeOpen}
        onOpenChange={setCloseOpen}
        title="Close ticket"
        description="Add a note describing the action you took. This is required and stored on the ticket."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCloseOpen(false)} disabled={closeMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={closeMutation.isPending}
              disabled={!closeAction.trim()}
              onClick={() => closeMutation.mutate()}
              iconLeft="task_alt"
            >
              Close ticket
            </Button>
          </>
        }
      >
        <FormField label="Action note" htmlFor="close-action" required>
          <Textarea
            id="close-action"
            value={closeAction}
            onChange={(e) => setCloseAction(e.target.value)}
            placeholder="Refund issued, project suspended, etc."
            rows={4}
          />
        </FormField>
        <ResultBanner
          tone="info"
          title="Confirm before closing"
          description="The user will see this status. Make sure the action is documented."
          className="mt-4"
        />
      </Modal>

      <ConfirmDialog
        open={false}
        onOpenChange={() => undefined}
        title=""
        onConfirm={() => undefined}
      />
    </div>
  );
}
