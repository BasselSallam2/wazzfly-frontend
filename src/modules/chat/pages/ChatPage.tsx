import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@components/layout/PageHeader';
import { Card } from '@components/ui/Card';
import { Avatar } from '@components/ui/Avatar';
import { Button } from '@components/ui/Button';
import { Textarea } from '@components/ui/Textarea';
import { Skeleton } from '@components/ui/Skeleton';
import { Icon } from '@components/ui/Icon';
import { EmptyState } from '@components/feedback/EmptyState';
import { LoadingState } from '@components/feedback/LoadingState';
import { ConfirmDialog } from '@components/feedback/ConfirmDialog';
import { chatApi } from '../api/chat.api';
import { QUERY_KEYS, ROUTES } from '@/config/constants';
import { formatRelative } from '@lib/format/date';
import { useCurrentUser } from '@lib/auth/useCurrentUser';
import { toast } from '@components/ui/Toast';
import { isApiError } from '@lib/api/errors';
import { useChatSocket } from '@lib/socket/useChatSocket';
import type { Chat, User } from '@/types';

function asUser(v: string | User | null | undefined): User | null {
  return typeof v === 'object' && v ? v : null;
}

function counterpart(chat: Chat, meId?: string): User | null {
  const others = chat.participants.map(asUser).filter((p): p is User => Boolean(p) && p?._id !== meId);
  return others[0] ?? null;
}

export function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const me = useCurrentUser();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useChatSocket(id);

  const chatsQuery = useQuery({
    queryKey: [QUERY_KEYS.chat.list],
    queryFn: () =>
      chatApi.list({
        sort: '-updatedAt',
        populate: [{ path: 'participants', select: 'name email avatar' }],
      }),
  });

  const threadQuery = useQuery({
    queryKey: [QUERY_KEYS.chat.detail, id],
    queryFn: () =>
      chatApi.get(id!, {
        populate: [
          { path: 'participants', select: 'name email avatar' },
          { path: 'messages.sender', select: 'name email avatar' },
        ],
      }),
    enabled: Boolean(id),
  });

  const sendMutation = useMutation({
    mutationFn: () => chatApi.sendMessage(id!, { text: text.trim() }),
    onSuccess: () => {
      setText('');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.chat.detail, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.chat.list] });
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Failed to send'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => chatApi.remove(id!),
    onSuccess: () => {
      toast.success('Chat deleted');
      setConfirmDelete(false);
      navigate(ROUTES.chat);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.chat.list] });
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Failed to delete chat'),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [id, threadQuery.data?.messages?.length]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Chat"
        description="Direct messages with users. Start a chat from a user profile or open one here."
      />
      <div className="grid h-[calc(100vh-260px)] min-h-[480px] grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="flex flex-col overflow-hidden">
          <div className="border-b border-outline-variant px-4 py-3">
            <p className="text-label-md font-semibold text-on-surface">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {chatsQuery.isLoading ? (
              <div className="space-y-2 p-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-14 w-full" />
                ))}
              </div>
            ) : (chatsQuery.data?.data ?? []).length === 0 ? (
              <EmptyState icon="forum" title="No chats yet" />
            ) : (
              <ul>
                {(chatsQuery.data?.data ?? []).map((c) => {
                  const other = counterpart(c, me?._id);
                  const isSelected = c._id === id;
                  return (
                    <li key={c._id}>
                      <button
                        type="button"
                        onClick={() => navigate(ROUTES.chatThread(c._id))}
                        className={`flex w-full items-center gap-3 border-b border-outline-variant p-3 text-left transition-colors hover:bg-surface-container-low ${
                          isSelected ? 'bg-primary-container/40' : ''
                        }`}
                      >
                        <Avatar name={other?.name} src={other?.avatar} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-label-md font-medium text-on-surface">
                            {other?.name ?? 'Unknown'}
                          </p>
                          <p className="line-clamp-1 text-body-sm text-on-surface-variant">
                            {c.lastMessage?.text ?? 'No messages yet'}
                          </p>
                        </div>
                        <span className="text-body-sm text-on-surface-variant">
                          {formatRelative(c.updatedAt)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          {!id ? (
            <div className="flex flex-1 items-center justify-center p-8">
              <EmptyState
                icon="chat"
                title="Pick a conversation"
                description="Choose a thread to view messages."
              />
            </div>
          ) : threadQuery.isLoading ? (
            <LoadingState />
          ) : threadQuery.data ? (
            (() => {
              const chat = threadQuery.data;
              const other = counterpart(chat, me?._id);
              return (
                <>
                  <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={other?.name} src={other?.avatar} size="md" />
                      <div>
                        <p className="text-label-md font-semibold text-on-surface">
                          {other?.name ?? 'Unknown'}
                        </p>
                        <p className="text-body-sm text-on-surface-variant">
                          {other?.email ?? ''}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete chat"
                      onClick={() => setConfirmDelete(true)}
                    >
                      <Icon name="delete" size={18} />
                    </Button>
                  </div>
                  <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
                    {(chat.messages?.length ?? 0) === 0 ? (
                      <p className="text-center text-body-md text-on-surface-variant">
                        Send the first message to start the conversation.
                      </p>
                    ) : (
                      <ul className="flex flex-col gap-3">
                        {chat.messages!.map((m, idx) => {
                          const sender = asUser(m.sender);
                          const fromMe = sender?._id === me?._id;
                          return (
                            <li
                              key={m._id ?? idx}
                              className={`flex gap-2 ${fromMe ? 'flex-row-reverse text-right' : ''}`}
                            >
                              <Avatar name={sender?.name} src={sender?.avatar} size="sm" />
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  fromMe
                                    ? 'bg-primary text-on-primary'
                                    : 'bg-surface-container-low text-on-surface'
                                }`}
                              >
                                <p className="whitespace-pre-wrap text-body-md">{m.text}</p>
                                <p
                                  className={`mt-1 text-body-sm ${
                                    fromMe ? 'text-on-primary/70' : 'text-on-surface-variant'
                                  }`}
                                >
                                  {formatRelative(m.createdAt)}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                  <div className="border-t border-outline-variant p-4">
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type a message…"
                      rows={2}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        iconRight="send"
                        loading={sendMutation.isPending}
                        disabled={!text.trim()}
                        onClick={() => sendMutation.mutate()}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()
          ) : null}
        </Card>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete chat?"
        description="This will permanently delete the conversation."
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        destructive
        confirmLabel="Delete chat"
      />
    </div>
  );
}
