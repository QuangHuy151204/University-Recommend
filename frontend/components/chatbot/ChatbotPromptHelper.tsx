'use client';
// @file: Suggested question chips shown above the chat input.
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Lightbulb, X } from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale';
import { cn } from '@/lib/utils';

const OWL_SRC = '/character.png';
const PANEL_WIDTH = 320;
const PANEL_GAP = 16;
const VIEWPORT_MARGIN = 12;

export const CHATBOT_PROMPT_EXAMPLES = [
    {
        key: 'recommend',
        promptVi:
            'Em được 24 điểm khối A00 muốn học CNTT ở Hà Nội thì nên chọn trường nào?',
        promptEn:
            'I scored 24 in block A00 and want to study IT in Hanoi — which universities should I consider?',
    },
    {
        key: 'cutoff',
        promptVi:
            'Điểm chuẩn Bách Khoa Hà Nội năm 2024 ngành điện tử là bao nhiêu?',
        promptEn:
            'What was HUST electronics cutoff score in 2024?',
    },
    {
        key: 'tuition',
        promptVi: 'Học phí trường Đại học Kinh tế Quốc dân khoảng bao nhiêu?',
        promptEn: 'What is NEU tuition fee roughly?',
    },
    {
        key: 'career',
        promptVi: 'Ngành Marketing ra trường làm gì?',
        promptEn: 'What jobs can I get with a Marketing degree?',
    },
    {
        key: 'compare',
        promptVi: 'So sánh USTH và HUST về điểm chuẩn CNTT năm 2025',
        promptEn: 'Compare USTH and HUST CNTT cutoff scores in 2025',
    },
] as const;

interface Props {
    onPickPrompt: (text: string) => void;
    disabled?: boolean;
    className?: string;
    placement?: 'rail' | 'mobile';
}

export function ChatbotPromptHelper({
    onPickPrompt,
    disabled = false,
    className,
    placement = 'rail',
}: Props) {
    const { t, locale } = useLocale();
    const panelId = useId();
    const anchorRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    function updatePanelPosition() {
        const anchor = anchorRef.current;
        const panel = panelRef.current;
        if (!anchor) return;

        const rect = anchor.getBoundingClientRect();
        const panelHeight = panel?.offsetHeight ?? 420;
        const maxTop = window.innerHeight - VIEWPORT_MARGIN - panelHeight;
        let top = rect.top;
        let left: number;

        if (placement === 'rail') {
            left = rect.left - PANEL_WIDTH - PANEL_GAP;
            if (left < VIEWPORT_MARGIN) {
                left = VIEWPORT_MARGIN;
            }
        } else {
            left = Math.min(
                rect.right - PANEL_WIDTH,
                window.innerWidth - PANEL_WIDTH - VIEWPORT_MARGIN,
            );
            left = Math.max(VIEWPORT_MARGIN, left);
            top = rect.top - panelHeight - PANEL_GAP;
        }

        top = Math.max(VIEWPORT_MARGIN, Math.min(top, maxTop));
        setPanelPos({ top, left });
    }

    useLayoutEffect(() => {
        if (!open) return;
        updatePanelPosition();
        const panel = panelRef.current;
        if (panel && typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(() => updatePanelPosition());
            ro.observe(panel);
            window.addEventListener('resize', updatePanelPosition);
            window.addEventListener('scroll', updatePanelPosition, true);
            return () => {
                ro.disconnect();
                window.removeEventListener('resize', updatePanelPosition);
                window.removeEventListener('scroll', updatePanelPosition, true);
            };
        }
        window.addEventListener('resize', updatePanelPosition);
        window.addEventListener('scroll', updatePanelPosition, true);
        return () => {
            window.removeEventListener('resize', updatePanelPosition);
            window.removeEventListener('scroll', updatePanelPosition, true);
        };
    }, [open, placement]);

    useEffect(() => {
        if (!open) return;
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }
        function onPointerDown(e: MouseEvent) {
            const target = e.target as Node;
            if (
                !anchorRef.current?.contains(target) &&
                !panelRef.current?.contains(target)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onPointerDown);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onPointerDown);
        };
    }, [open]);

    function pickExample(promptVi: string, promptEn: string) {
        onPickPrompt(locale === 'en' ? promptEn : promptVi);
        setOpen(false);
    }

    const tips = [
        t('chatbot.promptTip1'),
        t('chatbot.promptTip2'),
        t('chatbot.promptTip3'),
        t('chatbot.promptTip4'),
    ];

    const panel = open ? (
        <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-labelledby={`${panelId}-title`}
            style={{ top: panelPos.top, left: panelPos.left, width: PANEL_WIDTH }}
            className="fixed z-[200] max-h-[min(32rem,calc(100dvh-1.5rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
        >
            <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-secondary" />
                    <div>
                        <p
                            id={`${panelId}-title`}
                            className="font-display text-sm font-bold text-primary"
                        >
                            {t('chatbot.promptGuideTitle')}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {t('chatbot.promptGuideSubtitle')}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label={t('chatbot.closeGuide')}
                >
                    <X className="size-4" />
                </button>
            </div>

            <ul className="space-y-2 text-xs leading-relaxed text-slate-600">
                {tips.map((tip) => (
                    <li key={tip} className="flex gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary" />
                        <span>{tip}</span>
                    </li>
                ))}
            </ul>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('chatbot.promptExamplesTitle')}
            </p>
            <ul className="mt-2 space-y-1.5">
                {CHATBOT_PROMPT_EXAMPLES.map((ex) => {
                    const title = t(
                        `chatbot.promptExample.${ex.key}` as 'chatbot.promptExample.recommend',
                    );
                    const prompt =
                        locale === 'en' ? ex.promptEn : ex.promptVi;
                    return (
                        <li key={ex.key}>
                            <button
                                type="button"
                                onClick={() =>
                                    pickExample(ex.promptVi, ex.promptEn)
                                }
                                className="w-full rounded-xl border border-slate-100 bg-neutral/60 px-3 py-2 text-left transition-colors hover:border-primary/30 hover:bg-white"
                            >
                                <p className="text-xs font-semibold text-primary">
                                    {title}
                                </p>
                                <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">
                                    &ldquo;{prompt}&rdquo;
                                </p>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    ) : null;

    return (
        <>
            <button
                ref={anchorRef}
                type="button"
                disabled={disabled}
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                aria-label={t('chatbot.needHelp')}
                className={cn(
                    'group relative flex flex-col items-center gap-0.5 disabled:opacity-50',
                    className,
                )}
            >
                <span
                    className={cn(
                        'pointer-events-none absolute z-10 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm',
                        placement === 'rail'
                            ? '-top-2 left-1/2 -translate-x-1/2 whitespace-nowrap'
                            : '-top-1 right-0',
                    )}
                >
                    {t('chatbot.needHelp')}
                </span>
                <img
                    src={OWL_SRC}
                    alt=""
                    className={cn(
                        'w-auto object-contain transition-transform group-hover:scale-105 group-active:scale-95',
                        placement === 'rail'
                            ? 'h-24 lg:h-32'
                            : 'h-16',
                    )}
                />
            </button>

            {mounted && panel ? createPortal(panel, document.body) : null}
        </>
    );
}
