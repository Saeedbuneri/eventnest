import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(({ label, error, hint, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label">{label}</label>}
    <input
      ref={ref}
      className={cn(
        'input-field',
        error && 'border-red-400 focus:ring-red-400',
        className
      )}
      {...props}
    />
    {hint  && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
));
Input.displayName = 'Input';

export const Textarea = forwardRef(({ label, error, className, rows = 4, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label">{label}</label>}
    <textarea
      ref={ref}
      rows={rows}
      className={cn('input-field resize-none', error && 'border-red-400', className)}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';
