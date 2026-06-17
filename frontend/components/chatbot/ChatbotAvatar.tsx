import { cn } from '@/lib/utils';

const CHATBOT_AVATAR_SRC = '/chatbot-avatar.png';

type ChatbotAvatarProps = {
    className?: string;
    pulse?: boolean;
};

export function ChatbotAvatar({ className, pulse }: ChatbotAvatarProps) {
    return (
        <div
            className={cn(
                'relative size-9 shrink-0 overflow-hidden rounded-lg bg-primary/10',
                pulse && 'animate-pulse',
                className,
            )}
            aria-hidden
        >
            <img
                src={CHATBOT_AVATAR_SRC}
                alt=""
                className="size-full object-cover"
            />
        </div>
    );
}
