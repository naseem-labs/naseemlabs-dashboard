import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { LeadChatMessage } from '../../types/leadDetail';

interface ChatHistoryModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  patientName: string;
  patientPhone: string;
  messages: LeadChatMessage[];
  onClose: () => void;
}

function formatChatTime(isoDate: string | null): string {
  if (!isoDate) {
    return '';
  }

  return new Date(isoDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ChatHistoryModal({
  isOpen,
  isLoading,
  error,
  patientName,
  patientPhone,
  messages,
  onClose,
}: ChatHistoryModalProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !listRef.current) {
      return;
    }

    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [isOpen, messages]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-navy/50 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close chat"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-history-title"
        className="relative z-10 flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden bg-[#efeae2] shadow-2xl sm:h-[min(720px,90dvh)] sm:rounded-2xl"
      >
        <header className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              {patientName
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase() ?? '')
                .join('') || 'P'}
            </span>
            <div className="min-w-0">
              <h2 id="chat-history-title" className="truncate text-sm font-semibold">
                {patientName}
              </h2>
              <p className="truncate text-xs text-white/80">{patientPhone}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/15"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </header>

        <div
          ref={listRef}
          className="flex-1 space-y-2 overflow-y-auto px-3 py-4 sm:px-4"
        >
          {isLoading ? (
            <p className="rounded-lg bg-white/80 px-3 py-2 text-center text-sm text-slate-600">
              Loading chat...
            </p>
          ) : null}

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">
              {error}
            </p>
          ) : null}

          {!isLoading && !error && messages.length === 0 ? (
            <p className="rounded-lg bg-white/80 px-3 py-2 text-center text-sm text-slate-600">
              No chat history yet.
            </p>
          ) : null}

          {messages.map((message) => {
            const isAi = message.sender === 'ai';
            return (
              <div
                key={message.id}
                className={`flex ${isAi ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm sm:max-w-[75%] ${
                    isAi
                      ? 'rounded-tr-none bg-[#d9fdd3] text-navy'
                      : 'rounded-tl-none bg-white text-navy'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-5">
                    {message.content || '—'}
                  </p>
                  {message.sentAt ? (
                    <p className={`mt-1 text-[10px] text-slate-500 ${isAi ? 'text-right' : 'text-left'}`}>
                      {formatChatTime(message.sentAt)}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
