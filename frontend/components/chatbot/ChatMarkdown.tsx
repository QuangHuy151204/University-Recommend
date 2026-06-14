'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface Props {
    content: string;
    className?: string;
}

/**
 * Render câu trả lời chatbot (markdown từ backend: bảng, list, bold…).
 */
export function ChatMarkdown({ content, className }: Props) {
    return (
        <div className={cn('chat-markdown break-words', className)}>
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">
                        {children}
                    </ol>
                ),
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => (
                    <strong className="font-semibold text-slate-900">{children}</strong>
                ),
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-2 hover:text-primary-dark"
                    >
                        {children}
                    </a>
                ),
                table: ({ children }) => (
                    <div className="my-2 overflow-x-auto rounded-lg border border-slate-200">
                        <table className="min-w-full text-left text-xs sm:text-sm">
                            {children}
                        </table>
                    </div>
                ),
                thead: ({ children }) => (
                    <thead className="bg-neutral text-slate-700">{children}</thead>
                ),
                th: ({ children }) => (
                    <th className="border-b border-slate-200 px-3 py-2 font-semibold">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="border-b border-slate-100 px-3 py-2 align-top">
                        {children}
                    </td>
                ),
                tr: ({ children }) => (
                    <tr className="even:bg-slate-50/60">{children}</tr>
                ),
                code: ({ children }) => (
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-[0.85em] text-slate-800">
                        {children}
                    </code>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
        </div>
    );
}
