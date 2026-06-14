import { cn } from '@/lib/utils';

interface Step {
    id: number;
    label: string;
}

interface StepperProps {
    steps: Step[];
    current: number;
}

export function Stepper({ steps, current }: StepperProps) {
    return (
        <div className="mx-auto flex max-w-lg items-center justify-between">
            {steps.map((step, i) => {
                const done = step.id < current;
                const active = step.id === current;
                return (
                    <div key={step.id} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    'flex size-10 items-center justify-center rounded-full text-sm font-bold transition-colors',
                                    active && 'bg-primary text-white shadow-md',
                                    done && 'bg-primary/85 text-white',
                                    !active && !done && 'bg-slate-200 text-slate-500',
                                )}
                            >
                                {step.id}
                            </div>
                            <span
                                className={cn(
                                    'mt-2 text-xs font-medium',
                                    active ? 'text-primary' : 'text-slate-500',
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                className={cn(
                                    'mx-2 mb-6 h-0.5 flex-1',
                                    done ? 'bg-primary' : 'bg-slate-200',
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
