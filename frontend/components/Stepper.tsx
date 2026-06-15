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
        <div className="w-full" aria-label="Tiến trình">
            <div className="flex">
                {steps.map((step, i) => {
                    const done = step.id < current;
                    const active = step.id === current;
                    const prevDone = i > 0 && steps[i - 1].id < current;

                    return (
                        <div key={step.id} className="flex flex-1 items-center">
                            {i > 0 && (
                                <div
                                    className={cn(
                                        'h-0.5 flex-1',
                                        prevDone ? 'bg-primary' : 'bg-slate-200',
                                    )}
                                    aria-hidden
                                />
                            )}
                            <div
                                className={cn(
                                    'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors',
                                    active && 'bg-primary text-white shadow-md',
                                    done && 'bg-primary/85 text-white',
                                    !active && !done && 'bg-slate-200 text-slate-500',
                                )}
                                aria-current={active ? 'step' : undefined}
                            >
                                {step.id}
                            </div>
                            {i < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'h-0.5 flex-1',
                                        done ? 'bg-primary' : 'bg-slate-200',
                                    )}
                                    aria-hidden
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <div
                className="mt-2 grid gap-1"
                style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
            >
                {steps.map((step) => {
                    const active = step.id === current;
                    return (
                        <span
                            key={step.id}
                            className={cn(
                                'block min-h-10 px-1 text-center text-xs font-medium leading-snug',
                                active ? 'text-primary' : 'text-slate-500',
                            )}
                        >
                            {step.label}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
