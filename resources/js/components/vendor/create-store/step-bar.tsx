import React from 'react'
import {AlertCircle,CheckCircle} from 'lucide-react'
export default function StepBar({ current, stepErrors, labels }: {
    current: number; stepErrors: number[]; labels: string[];
}) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
            {labels.map((label, i) => {
                const hasError = stepErrors.includes(i);
                const done = i < current;
                const active = i === current;
                return (
                    <React.Fragment key={label}>
                        <div className="flex flex-col items-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                ${hasError ? 'bg-red-500 text-white ring-4 ring-red-100'
                                    : done ? 'bg-orange-500 text-white'
                                        : active ? 'bg-orange-500 text-white ring-4 ring-orange-200'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                {hasError ? <AlertCircle size={16} /> : done ? <CheckCircle size={16} /> : i + 1}
                            </div>
                            <span className={`text-xs mt-1 font-medium ${hasError ? 'text-red-500' : active ? 'text-orange-500' : 'text-gray-400'}`}>
                                {label}
                            </span>
                        </div>
                        {i < labels.length - 1 && (
                            <div className={`h-0.5 w-12 mx-1 mb-5 transition-all ${done ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
  )
}
