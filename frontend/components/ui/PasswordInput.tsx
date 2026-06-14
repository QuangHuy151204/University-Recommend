'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type PasswordInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type'
> & {
    wrapperClassName?: string;
};

export function PasswordInput({
    className,
    wrapperClassName,
    id,
    ...props
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className={cn('relative', wrapperClassName)}>
            <input
                id={id}
                type={visible ? 'text' : 'password'}
                className={cn('input-field pr-11', className)}
                {...props}
            />
            <button
                type="button"
                tabIndex={-1}
                aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onClick={() => setVisible((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition-colors hover:text-slate-600"
            >
                {visible ? (
                    <EyeOff className="size-4" aria-hidden />
                ) : (
                    <Eye className="size-4" aria-hidden />
                )}
            </button>
        </div>
    );
}
