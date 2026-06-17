'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import {
    Check,
    Copy,
    Plus,
    Send,
    Clock,
    Lock,
    Zap,
    User,
} from 'lucide-react';
import {
    getChatHistory,
    getChatSessions,
    sendChatMessage,
} from '@/services/chatbot';
import { ApiClientError } from '@/lib/api';
import { CHATBOT_FRESH_AFTER_LOGIN_KEY, useAuth } from '@/lib/auth';
import type { ChatHistoryItem, ChatMessage, ChatSessionSummary } from '@/types';
import { ChatCompareCard } from '@/components/chatbot/ChatCompareCard';
import { ChatbotAvatar } from '@/components/chatbot/ChatbotAvatar';
import { ChatMarkdown } from '@/components/chatbot/ChatMarkdown';
import { cn } from '@/lib/utils';

const SESSION_KEY = 'ur_chat_session_id';
const MESSAGES_KEY = 'ur_chat_messages';

const QUICK_ACTIONS = [
    {
        title: 'Gợi ý chọn trường',
        prompt: 'Em được 24 điểm khối A00 muốn học CNTT ở Hà Nội thì nên chọn trường nào?',
    },
    {
        title: 'Điểm chuẩn',
        prompt: 'Điểm chuẩn Bách Khoa Hà Nội năm 2024 ngành điện tử là bao nhiêu?',
    },
    {
        title: 'Học phí',
        prompt: 'Học phí trường Đại học Kinh tế Quốc dân khoảng bao nhiêu?',
    },
    {
        title: 'Nghề nghiệp',
        prompt: 'Ngành Marketing ra trường làm gì?',
    },
];

function historyToMessages(items: ChatHistoryItem[]): ChatMessage[] {
    const out: ChatMessage[] = [];
    for (const item of items) {
        out.push({
            id: `u-${item.id}`,
            role: 'user',
            text: item.question,
        });
        const compareIds =
            item.compare_university_ids?.filter((id) => id > 0).slice(0, 2) ??
            [];
        out.push({
            id: `a-${item.id}`,
            role: 'assistant',
            text: item.answer,
            compareUniversityIds:
                compareIds.length >= 2 ? compareIds : undefined,
        });
    }
    return out;
}

function generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadSession(): string {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
        id = generateId();
        localStorage.setItem(SESSION_KEY, id);
    }
    return id;
}

function normalizeMessage(raw: unknown): ChatMessage | null {
    if (!raw || typeof raw !== 'object') return null;
    const o = raw as Record<string, unknown>;
    const text =
        typeof o.text === 'string'
            ? o.text
            : typeof o.content === 'string'
              ? o.content
              : '';
    if (!text.trim()) return null;
    let role: ChatMessage['role'] = 'assistant';
    if (o.role === 'user' || o.role === 'assistant') {
        role = o.role;
    } else if (o.sender === 'user') {
        role = 'user';
    }
    const id =
        typeof o.id === 'string' && o.id.length > 0 ? o.id : generateId();
    const compareUniversityIds = Array.isArray(o.compareUniversityIds)
        ? o.compareUniversityIds.filter(
              (id): id is number => typeof id === 'number' && id > 0,
          )
        : undefined;
    return {
        id,
        role,
        text,
        engine: o.engine as ChatMessage['engine'],
        compareUniversityIds:
            compareUniversityIds && compareUniversityIds.length >= 2
                ? compareUniversityIds
                : undefined,
    };
}

function loadMessages(): ChatMessage[] {
    if (typeof window === 'undefined') return [];
    try {
        const cached = localStorage.getItem(MESSAGES_KEY);
        if (!cached) return [];
        const parsed = JSON.parse(cached) as unknown;
        if (!Array.isArray(parsed)) return [];
        return parsed
            .map(normalizeMessage)
            .filter((m): m is ChatMessage => m != null);
    } catch {
        return [];
    }
}

function persistMessages(messages: ChatMessage[]) {
    if (typeof window === 'undefined') return;
    if (messages.length === 0) {
        localStorage.removeItem(MESSAGES_KEY);
    } else {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
}

function ChatbotInner() {
    const { user, loading: authLoading } = useAuth();
    const [sessionId, setSessionId] = useState('');
    const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatReady, setChatReady] = useState(false);
    const [input, setInput] = useState(() => {
        if (typeof window === 'undefined') return '';
        const uni = new URLSearchParams(window.location.search).get('uni');
        return uni ? `Cho em biết về trường ${uni}` : '';
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const hydratedRef = useRef(false);
    const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    async function copyAssistantMessage(id: string, text: string) {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
            copyTimerRef.current = setTimeout(() => {
                setCopiedId((cur) => (cur === id ? null : cur));
            }, 2000);
        } catch {
            setError('Không copy được nội dung. Hãy chọn và copy thủ công.');
        }
    }

    useEffect(() => {
        return () => {
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        };
    }, []);

    /** Chỉ cập nhật sidebar — không ghi đè tin nhắn đang hiển thị. */
    async function reloadSidebar() {
        if (!user) return;
        try {
            const list = await getChatSessions();
            setSessions(list);
        } catch {
            setSessions([]);
        }
    }

    async function loadSessionHistory(key: string, replaceMessages = true) {
        if (!user) return;
        setSessionsLoading(true);
        try {
            const history = await getChatHistory(key);
            setSessionId(key);
            localStorage.setItem(SESSION_KEY, key);
            if (replaceMessages) {
                setMessages(historyToMessages(history));
            }
            await reloadSidebar();
        } catch {
            if (replaceMessages) setMessages([]);
        } finally {
            setSessionsLoading(false);
        }
    }

    async function switchSession(key: string) {
        if (!user) {
            setSessionId(key);
            localStorage.setItem(SESSION_KEY, key);
            setMessages(loadMessages());
            return;
        }
        await loadSessionHistory(key, true);
    }

    useEffect(() => {
        if (hydratedRef.current || authLoading) return;
        hydratedRef.current = true;

        async function init() {
            if (user) {
                const freshAfterLogin =
                    sessionStorage.getItem(CHATBOT_FRESH_AFTER_LOGIN_KEY) === '1';
                if (freshAfterLogin) {
                    sessionStorage.removeItem(CHATBOT_FRESH_AFTER_LOGIN_KEY);
                    const id = generateId();
                    localStorage.setItem(SESSION_KEY, id);
                    localStorage.removeItem(MESSAGES_KEY);
                    setSessionId(id);
                    setMessages([]);
                    await reloadSidebar();
                } else {
                    const sid = loadSession();
                    setSessionId(sid);
                    localStorage.removeItem(MESSAGES_KEY);
                    await loadSessionHistory(sid, true);
                }
            } else {
                const sid = loadSession();
                setSessionId(sid);
                setMessages(loadMessages());
            }
            setChatReady(true);
        }

        void init();
    }, [authLoading, user]);

    useEffect(() => {
        if (!user) {
            persistMessages(messages);
        }
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, user]);

    async function handleSend(text: string) {
        const trimmed = text.trim();
        if (!trimmed || loading) return;
        setError(null);
        const userMsg: ChatMessage = {
            id: generateId(),
            role: 'user',
            text: trimmed,
        };
        setMessages((prev) => {
            const next = [...prev, userMsg];
            if (!user) persistMessages(next);
            return next;
        });
        setInput('');
        setLoading(true);
        try {
            const sid = sessionId || loadSession();
            if (!sessionId) setSessionId(sid);
            const res = await sendChatMessage(trimmed, sid);
            const compareIds =
                res.compare_university_ids?.filter((id) => id > 0).slice(0, 2) ??
                [];
            setMessages((prev) => {
                const next = [
                    ...prev,
                    {
                        id: generateId(),
                        role: 'assistant' as const,
                        text: res.answer,
                        engine: res.engine,
                        compareUniversityIds:
                            compareIds.length >= 2 ? compareIds : undefined,
                    },
                ];
                if (!user) persistMessages(next);
                return next;
            });
            if (user) {
                void reloadSidebar();
            }
        } catch (err) {
            setError(
                err instanceof ApiClientError
                    ? err.message
                    : 'Không kết nối được backend.',
            );
        } finally {
            setLoading(false);
        }
    }

    function resetChat() {
        const id = generateId();
        localStorage.setItem(SESSION_KEY, id);
        localStorage.removeItem(MESSAGES_KEY);
        setSessionId(id);
        setMessages([]);
        setError(null);
    }

    const showWelcome = messages.length === 0;

    return (
        <div className="flex h-[calc(100vh-4.5rem)] bg-neutral">
            {/* Sidebar */}
            <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
                <div className="p-4">
                    <button
                        type="button"
                        onClick={resetChat}
                        className="btn-secondary w-full justify-center"
                    >
                        <Plus className="size-4" />
                        Cuộc trò chuyện mới
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-3">
                    <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {user ? 'Cuộc trò chuyện (tối đa 5)' : 'Lịch sử cục bộ'}
                    </p>
                    {sessionsLoading && user ? (
                        <p className="px-3 py-4 text-xs text-slate-400">Đang tải…</p>
                    ) : (
                        <ul className="mt-2 space-y-1">
                            {user &&
                                sessions.map((item) => {
                                    const active = item.session_id === sessionId;
                                    return (
                                        <li key={item.session_id}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void switchSession(item.session_id)
                                                }
                                                className={cn(
                                                    'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                                                    active
                                                        ? 'bg-primary/10 font-medium text-primary'
                                                        : 'text-slate-600 hover:bg-neutral',
                                                )}
                                            >
                                                <Clock className="size-4 shrink-0" />
                                                <span className="line-clamp-2">
                                                    {item.title}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            {user && sessions.length === 0 && !sessionsLoading && (
                                <li className="px-3 py-2 text-xs text-slate-500">
                                    Chưa có cuộc trò chuyện đã lưu. Gửi câu hỏi để bắt đầu.
                                </li>
                            )}
                            {!user && (
                                <li className="px-3 py-2 text-xs text-slate-500">
                                    Đăng nhập để lưu tối đa 5 cuộc hội thoại trên tài khoản.
                                </li>
                            )}
                        </ul>
                    )}
                </div>
                <div className="border-t border-slate-100 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                            {(user?.name || 'HS').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">
                                {user?.name || 'Khách'}
                            </p>
                            <p className="text-xs text-slate-500">Học sinh lớp 12</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main chat */}
            <div className="flex min-w-0 flex-1 flex-col">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-4 py-6 sm:px-8"
                >
                    <div className="mx-auto max-w-2xl space-y-6">
                        {showWelcome && (
                            <div className="flex gap-3">
                                <ChatbotAvatar />
                                <div className="card flex-1 p-4">
                                    <p className="text-sm leading-relaxed text-slate-700">
                                        Xin chào! Tôi là chatbot UniGuide. Bạn có thể
                                        hỏi về trường, ngành, điểm chuẩn và học phí — tôi
                                        sẽ tra cứu và giải thích rõ ràng.
                                    </p>
                                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                        {QUICK_ACTIONS.map((a) => (
                                            <button
                                                key={a.title}
                                                type="button"
                                                onClick={() => void handleSend(a.prompt)}
                                                className="rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-primary/40 hover:bg-neutral"
                                            >
                                                <p className="text-sm font-semibold text-primary">
                                                    {a.title}
                                                </p>
                                                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                                    &quot;{a.prompt.slice(0, 50)}…&quot;
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {chatReady &&
                            messages.map((m) => {
                                const isUser = m.role === 'user';
                                return (
                                    <div
                                        key={m.id}
                                        className={cn(
                                            'flex gap-3',
                                            isUser ? 'flex-row-reverse' : '',
                                        )}
                                    >
                                        {isUser ? (
                                            <div
                                                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700"
                                                aria-hidden
                                            >
                                                <User className="size-5" />
                                            </div>
                                        ) : (
                                            <ChatbotAvatar />
                                        )}
                                        <div
                                            className={
                                                isUser
                                                    ? 'chat-bubble-user'
                                                    : 'chat-bubble-assistant'
                                            }
                                        >
                                            {isUser ? (
                                                <div className="whitespace-pre-wrap break-words">
                                                    {m.text}
                                                </div>
                                            ) : (
                                                <ChatMarkdown content={m.text} />
                                            )}
                                            {!isUser &&
                                                m.compareUniversityIds &&
                                                m.compareUniversityIds.length >=
                                                    2 && (
                                                    <ChatCompareCard
                                                        universityIds={
                                                            m.compareUniversityIds
                                                        }
                                                    />
                                                )}
                                            {!isUser && (
                                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                                    {m.engine && (
                                                        <span
                                                            className={cn(
                                                                'inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase',
                                                                m.engine === 'ollama'
                                                                    ? 'bg-secondary/20 text-secondary-dark'
                                                                    : 'bg-slate-100 text-slate-600',
                                                            )}
                                                        >
                                                            {m.engine === 'ollama'
                                                                ? 'Chatbot'
                                                                : 'Tra cứu'}
                                                        </span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            void copyAssistantMessage(
                                                                m.id,
                                                                m.text,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-primary"
                                                        aria-label="Copy câu trả lời"
                                                    >
                                                        {copiedId === m.id ? (
                                                            <>
                                                                <Check className="size-3.5" />
                                                                Đã copy
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="size-3.5" />
                                                                Copy
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                        {loading && (
                            <div className="flex gap-3">
                                <ChatbotAvatar pulse />
                                <div className="card px-4 py-3 text-sm text-slate-500">
                                    Đang trả lời…
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mx-auto max-w-2xl px-4 pb-2">
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    </div>
                )}

                <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-8">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            void handleSend(input);
                        }}
                        className="mx-auto max-w-2xl"
                    >
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-md">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập câu hỏi của bạn tại đây..."
                                disabled={loading}
                                className="min-w-0 flex-1 border-0 bg-transparent text-sm focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-white transition-colors hover:bg-secondary-dark disabled:opacity-50"
                            >
                                <Send className="size-4" />
                            </button>
                        </div>
                        <p className="mt-2 flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                                <Lock className="size-3" />
                                Thông tin tra cứu trên hệ thống
                            </span>
                            <span className="flex items-center gap-1">
                                <Zap className="size-3" />
                                Trả lời bằng tiếng Việt
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ChatbotPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-96 items-center justify-center text-slate-500">
                    Đang tải…
                </div>
            }
        >
            <ChatbotInner />
        </Suspense>
    );
}
